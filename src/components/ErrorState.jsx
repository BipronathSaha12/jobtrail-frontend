import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({ message = "Could not load your applications.", onRetry }) {
  return (
    <div className="state-container">
      <AlertCircle size={48} style={{ color: "#f43f5e" }} className="state-icon" />
      <h3 className="state-title">{message}</h3>
      <p className="state-desc">
        Please check your network connection or backend server status and try again.
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary">
          <RefreshCw size={16} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
