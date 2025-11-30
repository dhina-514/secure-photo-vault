import React from "react";

function SettingsPage() {
  return (
    <div className="container main-vault-container">
      <div className="card glass-card mb-4">
        <div className="card-body">
          <h5 className="section-title mb-2">Settings</h5>
          <p className="section-subtitle mb-3">
            Manage account preferences and security options.
          </p>
          <ul className="small text-muted mb-0">
            <li>Change account password (future)</li>
            <li>Set default sort order</li>
            <li>Configure auto-lock timeout</li>
            <li>Export or delete account data (future)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
