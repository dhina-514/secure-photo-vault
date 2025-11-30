import React from "react";

function ActivityPage() {
  return (
    <div className="container main-vault-container">
      <div className="card glass-card mb-4">
        <div className="card-body">
          <h5 className="section-title mb-2">Activity</h5>
          <p className="section-subtitle mb-3">
            Recent uploads, deletions, and security events (future enhancement).
          </p>
          <p className="text-muted small mb-0">
            You can later plug this into an /activity API on the backend to
            show a full audit log.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;
