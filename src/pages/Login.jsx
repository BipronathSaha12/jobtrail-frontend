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
          
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: "100%", marginTop: "0.75rem" }}
            disabled={loading}
            onClick={() => {
              setForm({ username: 'demo', password: 'demo123' });
            }}
            title="Auto-fill demo credentials"
          >
            <User size={18} />
            <span>Use Demo Account</span>
          </button>
        </form>

        <div className="auth-footer">
          New here? <Link to="/register" className="auth-link">Create account</Link>
        </div>
      </div>
    </div>
  );
}
