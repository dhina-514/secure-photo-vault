// src/pages/LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Go to auth page, default mode = login
    navigate("/auth?mode=login");
  };

  const handleRegisterClick = () => {
    // Go to auth page with register mode
    navigate("/auth?mode=register");
  };

  return (
    <div className="landing-wrapper d-flex justify-content-center align-items-center">
      <div className="landing-card shadow-lg">
        <h2 className="landing-title mb-2">Secure Photo Vault</h2>
        <p className="landing-subtitle mb-4">
          End-to-end encrypted photo storage. Images are encrypted in your
          browser before upload &mdash; the server only sees ciphertext.
        </p>

        <div className="d-flex gap-2 justify-content-center mb-3">
          <button
            type="button"
            className="btn btn-primary px-4"
            onClick={handleLoginClick}
          >
            Login
          </button>
          <button
            type="button"
            className="btn btn-outline-light px-4"
            onClick={handleRegisterClick}
          >
            Create account
          </button>
        </div>

        <p className="landing-footer-text mb-0">
          Built with MERN + client-side crypto. Perfect for private snapshots,
          documents, and more.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
