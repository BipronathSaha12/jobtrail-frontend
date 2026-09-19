import React from "react";
import { Link } from "react-router-dom";
import { Inbox, Plus } from "lucide-react";

export default function EmptyState({ isFiltered = false, actionText = "+ Add application", actionLink = "/applications/new" }) {
  return (
    <div className="state-container">
      <Inbox size={48} className="state-icon" />
      <h3 className="state-title">
        {isFiltered ? "No applications match this filter" : "No applications yet"}
      </h3>
      <p className="state-desc">
        {isFiltered
          ? "Try adjusting your search criteria or clearing filters to see more applications."
          : "Start tracking your job search journey by adding your first job application."}
      </p>
      {!isFiltered && (
        <Link to={actionLink} className="btn btn-primary">
          <Plus size={18} />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
}
