import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  Briefcase,
  LayoutDashboard,
  List,
  Kanban,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    signOut();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon">
            <Briefcase size={22} />
          </div>
          <span>JobTrail</span>
        </Link>

        {user && (
          <>
            {/* Desktop Navigation Links */}
            <div className="nav-links desktop-only">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/applications"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <List size={18} />
                <span>Applications</span>
              </NavLink>

              <NavLink
                to="/kanban"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Kanban size={18} />
                <span>Kanban Board</span>
              </NavLink>
            </div>

            {/* Desktop User Profile */}
            <div className="user-profile desktop-only">
              <div className="user-badge">
                <User size={16} />
                <span>{user}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-logout"
                title="Sign Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="navbar-toggle-btn mobile-only"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Drawer Menu & Backdrop */}
      {user && mobileMenuOpen && (
        <>
          <div
            className="navbar-mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="navbar-mobile-drawer" role="dialog" aria-label="Mobile Navigation">
            <div className="navbar-mobile-links">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `navbar-mobile-link ${isActive ? "active" : ""}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/applications"
                className={({ isActive }) =>
                  `navbar-mobile-link ${isActive ? "active" : ""}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <List size={20} />
                <span>Applications</span>
              </NavLink>

              <NavLink
                to="/kanban"
                className={({ isActive }) =>
                  `navbar-mobile-link ${isActive ? "active" : ""}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <Kanban size={20} />
                <span>Kanban Board</span>
              </NavLink>
            </div>

            <div className="navbar-mobile-footer">
              <div className="user-badge mobile-user-badge">
                <User size={16} />
                <span>Signed in as <strong>{user}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-danger mobile-logout-btn"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

