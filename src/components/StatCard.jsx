import React from "react";

export default function StatCard({ title, count, icon: Icon, badgeClass }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && <Icon size={20} className="text-secondary" />}
      </div>
      <div className="stat-value">{count ?? 0}</div>
      {badgeClass && (
        <div style={{ marginTop: '0.5rem' }}>
          <span className={`status-badge ${badgeClass}`}>{title}</span>
        </div>
      )}
    </div>
  );
}
