import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import { Briefcase, UserPlus, Mail, Lock, User } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError(null);

    try {
      await register(form);
      try {
        // Attempt auto-login
        await signIn({ username: form.username, password: form.password });
        navigate("/");
      } catch (loginErr) {
        // Fallback if auto login fails
        navigate("/login", { state: { message: "Account created successfully! Please sign in." } });
      }
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          setErrors(data);
          if (data.detail) {
            setGeneralError(data.detail);
          } else if (data.non_field_errors) {
            setGeneralError(data.non_field_errors[0]);
          }
        } else {
          setGeneralError("Registration failed. Please check your inputs.");
        }
      } else {
        setGeneralError("Network error. Please make sure the backend server is running.");
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
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join JobTrail to track your applications</p>
        </div>

        {generalError && <div className="error-banner">{generalError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                name="username"
                className={`form-input ${errors.username ? "has-error" : ""}`}
                style={{ paddingLeft: "2.75rem" }}
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            {errors.username && <small className="field-error">{errors.username[0]}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? "has-error" : ""}`}
                style={{ paddingLeft: "2.75rem" }}
                placeholder="your.email@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            {errors.email && <small className="field-error">{errors.email[0]}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Password (min 6 characters)</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? "has-error" : ""}`}
                style={{ paddingLeft: "2.75rem" }}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
            {errors.password && <small className="field-error">{errors.password[0]}</small>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Creating account..." : (
              <>
                <UserPlus size={18} />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
