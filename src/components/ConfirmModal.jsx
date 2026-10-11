import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isDeleting }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f43f5e" }}>
            <AlertTriangle size={22} />
            <h3 className="modal-title" style={{ margin: 0 }}>Confirm Delete</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="modal-close-btn"
            aria-label="Close confirmation dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            {title}
          </p>
          <p>{message || "This action cannot be undone."}</p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
