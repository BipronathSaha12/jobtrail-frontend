import React from "react";

export default function Loader({ message = "Loading applications..." }) {
  return (
    <div className="state-container">
      <div className="spinner"></div>
      <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{message}</p>
    </div>
  );
}
