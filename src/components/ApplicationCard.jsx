import React from "react";
import { Link } from "react-router-dom";
import { Edit2, Trash2, ExternalLink, Calendar, DollarSign } from "lucide-react";

export default function ApplicationCard({ application, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="app-card">
      <div className="app-main-info">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <h3 className="app-position">{application.position}</h3>
          <span className={`status-badge badge-${application.status}`}>
            {application.status}
          </span>
          <span className="jobtype-badge">{application.job_type}</span>
        </div>

        <div className="app-company">
          <span>{application.company}</span>
          {application.job_link && (
            <a
              href={application.job_link}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Job Link"
              style={{ color: "var(--accent-primary)", display: "inline-flex" }}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        <div className="app-meta">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            <Calendar size={14} />
            Applied: {formatDate(application.applied_on || application.created_at)}
          </span>

          {application.expected_salary && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              <DollarSign size={14} />
              {application.expected_salary.toLocaleString()}
            </span>
          )}
        </div>

        {application.notes && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {application.notes}
          </p>
        )}
      </div>

      <div className="app-actions">
        <Link
          to={`/applications/${application.id}/edit`}
          className="action-btn"
          title="Edit Application"
        >
          <Edit2 size={18} />
        </Link>
        <button
          onClick={() => onDelete(application)}
          className="action-btn delete"
          title="Delete Application"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
