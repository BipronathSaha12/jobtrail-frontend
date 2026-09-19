import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getApplication, createApplication, updateApplication } from "../api/applications";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { Save, ArrowLeft } from "lucide-react";

export default function ApplicationForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "WISHLIST",
    job_type: "ONSITE",
    applied_on: "",
    expected_salary: "",
    job_link: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      getApplication(id)
        .then((data) => {
          setForm({
            company: data.company || "",
            position: data.position || "",
            status: data.status || "WISHLIST",
            job_type: data.job_type || "ONSITE",
            applied_on: data.applied_on || "",
            expected_salary: data.expected_salary ?? "",
            job_link: data.job_link || "",
            notes: data.notes || "",
          });
        })
        .catch((err) => {
          console.error("Failed to load application for editing:", err);
          setGeneralError("Could not load application details.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setGeneralError(null);

    // Prepare payload
    const payload = {
      ...form,
      applied_on: form.applied_on || null,
      expected_salary: form.expected_salary !== "" ? Number(form.expected_salary) : null,
    };

    try {
      if (isEditMode) {
        await updateApplication(id, payload);
      } else {
        await createApplication(payload);
      }
      navigate("/applications");
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data) {
        setErrors(err.response.data);
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading application details..." />;
  if (generalError && isEditMode && !form.company) {
    return <ErrorState message={generalError} onRetry={() => navigate("/applications")} />;
  }

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          to="/applications"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Applications</span>
        </Link>
      </div>

      <div className="form-card">
        <h1 className="page-title" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
          {isEditMode ? "Edit Application" : "Add New Application"}
        </h1>

        {generalError && <div className="error-banner">{generalError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Company Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="company"
                className={`form-input ${errors.company ? "has-error" : ""}`}
                placeholder="e.g. Brain Station 23"
                value={form.company}
                onChange={handleChange}
                required
              />
              {errors.company && <small className="field-error">{errors.company[0]}</small>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Position Title <span className="required">*</span>
              </label>
              <input
                type="text"
                name="position"
                className={`form-input ${errors.position ? "has-error" : ""}`}
                placeholder="e.g. Frontend Developer"
                value={form.position}
                onChange={handleChange}
                required
              />
              {errors.position && <small className="field-error">{errors.position[0]}</small>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Application Status</label>
              <select
                name="status"
                className={`form-select ${errors.status ? "has-error" : ""}`}
                value={form.status}
                onChange={handleChange}
              >
                <option value="WISHLIST">Wishlist</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
              {errors.status && <small className="field-error">{errors.status[0]}</small>}
            </div>

            <div className="form-group">
              <label className="form-label">Job Work Type</label>
              <select
                name="job_type"
                className={`form-select ${errors.job_type ? "has-error" : ""}`}
                value={form.job_type}
                onChange={handleChange}
              >
                <option value="ONSITE">Onsite</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
              {errors.job_type && <small className="field-error">{errors.job_type[0]}</small>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Applied Date</label>
              <input
                type="date"
                name="applied_on"
                className={`form-input ${errors.applied_on ? "has-error" : ""}`}
                value={form.applied_on}
                onChange={handleChange}
              />
              {errors.applied_on && <small className="field-error">{errors.applied_on[0]}</small>}
            </div>

            <div className="form-group">
              <label className="form-label">Expected Salary (BDT/Month)</label>
              <input
                type="number"
                name="expected_salary"
                className={`form-input ${errors.expected_salary ? "has-error" : ""}`}
                placeholder="e.g. 50000"
                value={form.expected_salary}
                onChange={handleChange}
                min={0}
              />
              {errors.expected_salary && <small className="field-error">{errors.expected_salary[0]}</small>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Listing URL</label>
            <input
              type="url"
              name="job_link"
              className={`form-input ${errors.job_link ? "has-error" : ""}`}
              placeholder="https://example.com/jobs/123"
              value={form.job_link}
              onChange={handleChange}
            />
            {errors.job_link && <small className="field-error">{errors.job_link[0]}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Details</label>
            <textarea
              name="notes"
              rows={4}
              className={`form-textarea ${errors.notes ? "has-error" : ""}`}
              placeholder="Referrals, recruiter contact info, interview notes..."
              value={form.notes}
              onChange={handleChange}
            />
            {errors.notes && <small className="field-error">{errors.notes[0]}</small>}
          </div>

          <div className="form-actions">
            <Link to="/applications" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : (
                <>
                  <Save size={18} />
                  <span>{isEditMode ? "Update Application" : "Save Application"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
