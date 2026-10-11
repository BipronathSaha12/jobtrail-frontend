import React from "react";
import { Link } from "react-router-dom";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  Loader2,
} from "lucide-react";

export default function KanbanCard({
  application,
  onDelete,
  onQuickMove,
  isMoving = false,
  isDragOverlay = false,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: String(application.id),
    data: { application },
    disabled: isDragOverlay,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
      }
    : undefined;

  const STATUS_OPTIONS = [
    { value: "WISHLIST", label: "Wishlist" },
    { value: "APPLIED", label: "Applied" },
    { value: "INTERVIEW", label: "Interview" },
    { value: "OFFER", label: "Offer" },
    { value: "REJECTED", label: "Rejected" },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? "dragging" : ""} ${
        isDragOverlay ? "drag-overlay-card" : ""
      }`}
    >
      <div className="kanban-card-header">
        <div
          className="kanban-drag-handle"
          {...attributes}
          {...listeners}
          title="Drag to change status"
        >
          <GripVertical size={16} />
        </div>

        <div className="kanban-card-title-group">
          <span className="kanban-card-position" title={application.position}>
            {application.position}
          </span>
          <span className="kanban-card-company" title={application.company}>
            {application.company}
          </span>
        </div>

        {application.job_url && (
          <a
            href={application.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="kanban-external-link"
            title="View original job posting"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Meta tags */}
      <div className="kanban-card-meta">
        <span className="jobtype-badge">{application.job_type || "REMOTE"}</span>
        {application.expected_salary && (
          <span className="kanban-meta-item">
            <DollarSign size={12} />
            <span>${Number(application.expected_salary).toLocaleString()}</span>
          </span>
        )}
        {application.applied_on && (
          <span className="kanban-meta-item">
            <Calendar size={12} />
            <span>{application.applied_on}</span>
          </span>
        )}
      </div>

      {/* Card footer: Quick Move Dropdown & Action buttons */}
      <div className="kanban-card-footer">
        <div className="kanban-quick-move">
          <label htmlFor={`quick-move-${application.id}`} className="sr-only">
            Move status
          </label>
          <select
            id={`quick-move-${application.id}`}
            value={application.status}
            onChange={(e) => {
              if (onQuickMove) onQuickMove(application, e.target.value);
            }}
            disabled={isMoving}
            className="kanban-quick-select"
            title="Change status"
            onClick={(e) => e.stopPropagation()}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                → {opt.label}
              </option>
            ))}
          </select>
          {isMoving && <Loader2 size={12} className="spin-icon kanban-moving-spinner" />}
        </div>

        <div className="kanban-card-actions">
          <Link
            to={`/applications/${application.id}/edit`}
            className="kanban-action-btn edit"
            title="Edit Application"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit2 size={13} />
          </Link>
          <button
            type="button"
            className="kanban-action-btn delete"
            title="Delete Application"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete(application);
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
