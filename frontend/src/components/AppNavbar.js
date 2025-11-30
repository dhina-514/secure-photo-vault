// frontend/src/components/AppNavbar.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle"; // ✅ correct import

function AppNavbar() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail") || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark nav-glass">
      <div className="container">
        <span
          className="navbar-brand fw-semibold"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          🔐 Secure Photo Vault
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#vaultNav"
          aria-controls="vaultNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="vaultNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/gallery" className="nav-link">
                Gallery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/upload" className="nav-link">
                Upload
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* 🌗 Theme toggle button */}
            <ThemeToggle />

            {email && (
              <span className="small text-muted d-none d-md-inline">
                {email}
              </span>
            )}
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
