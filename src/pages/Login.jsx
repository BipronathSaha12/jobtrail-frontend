import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Briefcase, LogIn, Lock, User } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  const successMsg = location.state?.message;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(form);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (data.detail) {
          setError(data.detail);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors[0]);
        } else if (data.username) {
          setError(data.username[0]);
        } else if (data.password) {
          setError(data.password[0]);
        } else {
          setError("Invalid login credentials.");
        }
      } else if (!err.response) {
        setError("Network error. Please make sure the backend server is running on http://127.0.0.1:8000.");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleQuickDemoLogin = async (demoUsername, demoPassword) => {
    setForm({ username: demoUsername, password: demoPassword });
    setLoading(true);
    setError(null);
    try {
      await signIn({ username: demoUsername, password: demoPassword });
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Could not sign in with demo account. Please ensure the backend server is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const adminUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/api\/?$/, "/admin/");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon" style={{ display: "inline-flex" }}>
            <Briefcase size={28} />
          </div>
          <h1 className="auth-title">Welcome to JobTrail</h1>
          <p className="auth-subtitle">Sign in to manage your job application tracker</p>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: "rgba(48, 108, 70, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)", color: "#4ade80", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
            {successMsg}
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                name="username"
                className="form-input"
                style={{ paddingLeft: "2.75rem" }}
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="password"
                name="password"
                className="form-input"
                style={{ paddingLeft: "2.75rem" }}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : (
              <>
                <LogIn size={18} />
                <span>Sign in</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts for Easy Testing */}
        <div className="demo-accounts-box" style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "rgba(255, 255, 255, 0.03)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-color)" }}>
          <p style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>⚡ Quick Demo & Testing Access</span>
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "flex-start", padding: "0.6rem 0.9rem", fontSize: "0.875rem" }}
              disabled={loading}
              onClick={() => handleQuickDemoLogin("demo", "demo123")}
              title="1-click sign in as demo job seeker"
            >
              <User size={16} style={{ color: "var(--accent-primary)" }} />
              <span style={{ flex: 1, textAlign: "left" }}>1-Click Job Seeker Demo</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>demo / demo123</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "flex-start", padding: "0.6rem 0.9rem", fontSize: "0.875rem" }}
              disabled={loading}
              onClick={() => handleQuickDemoLogin("admin", "admin123")}
              title="1-click sign in as demo admin"
            >
              <Lock size={16} style={{ color: "#a855f7" }} />
              <span style={{ flex: 1, textAlign: "left" }}>1-Click Admin Demo</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>admin / admin123</span>
            </button>
          </div>

          <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <span>Django Admin Portal:</span>
            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: 600 }}
              title="Open Django Admin in a new tab"
            >
              Open /admin/ →
            </a>
          </div>
        </div>

        <div className="auth-footer">
          New here? <Link to="/register" className="auth-link">Create account</Link>
        </div>
      </div>
    </div>
  );
}
