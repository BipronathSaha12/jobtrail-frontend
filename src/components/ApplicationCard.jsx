import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit2, Trash2, ExternalLink, Calendar, DollarSign, Check, Loader2 } from "lucide-react";
import { updateApplication } from "../api/applications";

export default function ApplicationCard({ application, onDelete, onStatusChange }) {
  const [currentStatus, setCurrentStatus] = useState(application.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);

  // Sync state if prop changes
  useEffect(() => {
    setCurrentStatus(application.status);
  }, [application.status]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Avoid UTC timezone off-by-one day shift for calendar dates (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    // Datetime timestamp (e.g. created_at) converts UTC to user local time
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleStatusSelect = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    setIsUpdatingStatus(true);
    setStatusError(null);

    try {
      const updatedApp = await updateApplication(application.id, { status: newStatus });
      setCurrentStatus(updatedApp.status);
      if (onStatusChange) {
        onStatusChange(updatedApp);
      }
    } catch (err) {
      console.error("Failed to update application status:", err);
      // Revert status on failure so UI matches DB
      setCurrentStatus(previousStatus);
      setStatusError("Could not save status change. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="app-card">
      <div className="app-main-info">
        <div className="app-header-row">
          <h3 className="app-position">{application.position}</h3>
          
          <div className="status-select-container">
            <label htmlFor={`status-select-${application.id}`} className="sr-only">
              Change status for {application.position}
            </label>
            <div className="status-badge-wrapper">
              <select
                id={`status-select-${application.id}`}
                className={`status-select-badge badge-${currentStatus}`}
                value={currentStatus}
                onChange={handleStatusSelect}
                disabled={isUpdatingStatus}
                aria-label={`Application status: currently ${currentStatus}. Change status`}
              >
                <option value="WISHLIST">Wishlist</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
              {isUpdatingStatus && (
                <span className="status-saving-spinner" title="Saving status...">
                  <Loader2 size={12} className="spin-icon" aria-hidden="true" />
                </span>
              )}
            </div>
          </div>

          <span className="jobtype-badge">{application.job_type}</span>
        </div>

        {statusError && (
          <div className="status-inline-error" role="alert">
            {statusError}
          </div>
        )}

        <div className="app-company">
          <span>{application.company}</span>
          {application.job_link && (
            <a
              href={application.job_link}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Job Link"
              aria-label={`Open job link for ${application.position} at ${application.company}`}
              className="job-external-link"
            >
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="app-meta">
          <span className="meta-item">
            <Calendar size={14} aria-hidden="true" />
            <span>Applied: {formatDate(application.applied_on || application.created_at)}</span>
          </span>

          {application.expected_salary && (
            <span className="meta-item">
              <DollarSign size={14} aria-hidden="true" />
              <span>{application.expected_salary.toLocaleString()} BDT</span>
            </span>
          )}
        </div>

        {application.notes && (
          <p className="app-notes">
            {application.notes}
          </p>
        )}
      </div>

      <div className="app-actions">
        <Link
          to={`/applications/${application.id}/edit`}
          className="action-btn edit-btn"
          title="Edit Application"
          aria-label={`Edit application for ${application.position} at ${application.company}`}
        >
          <Edit2 size={18} aria-hidden="true" />
          <span className="btn-label-mobile">Edit</span>
        </Link>
        <button
          type="button"
          onClick={() => onDelete(application)}
          className="action-btn delete-btn"
          title="Delete Application"
          aria-label={`Delete application for ${application.position} at ${application.company}`}
        >
          <Trash2 size={18} aria-hidden="true" />
          <span className="btn-label-mobile">Delete</span>
        </button>
      </div>
    </div>
  );
}
