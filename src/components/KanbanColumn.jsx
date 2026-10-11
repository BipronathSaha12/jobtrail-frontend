import React from "react";
import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";
import { Inbox } from "lucide-react";

export default function KanbanColumn({
  id,
  title,
  icon: Icon,
  badgeClass,
  applications = [],
  onDelete,
  onQuickMove,
  movingCardId,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: { status: id },
  });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? "column-drop-active" : ""}`}
      data-status={id}
    >
      <div className={`kanban-column-header ${badgeClass}`}>
        <div className="kanban-header-left">
          {Icon && <Icon size={16} className="kanban-header-icon" />}
          <h3 className="kanban-column-title">{title}</h3>
        </div>
        <span className="kanban-count-badge">{applications.length}</span>
      </div>

      <div className="kanban-cards-container">
        {applications.length === 0 ? (
          <div className="kanban-empty-column">
            <Inbox size={24} className="text-muted" />
            <p>No applications here</p>
            <span className="text-muted kanban-drop-hint">Drop jobs here</span>
          </div>
        ) : (
          applications.map((app) => (
            <KanbanCard
              key={app.id}
              application={app}
              onDelete={onDelete}
              onQuickMove={onQuickMove}
              isMoving={movingCardId === app.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
