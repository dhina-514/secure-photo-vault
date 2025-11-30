// src/pages/AuthPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?mode=login or ?mode=register from URL
  const searchParams = new URLSearchParams(location.search);
  const initialMode = searchParams.get("mode"); // "login" or "register" or null

  const [showLogin, setShowLogin] = useState(initialMode !== "register");

  // If URL mode changes (user comes again from landing buttons), update tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    setShowLogin(mode !== "register");
  }, [location.search]);

  const handleLoginSuccess = () => {
    // on successful login, go to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-wrapper d-flex justify-content-center align-items-center">
      <div className="container" style={{ maxWidth: "420px" }}>
        <div className="card bg-dark border-secondary shadow-lg">
          <div className="card-body p-4">
            {showLogin ? (
              <Login
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={() => {
                  setShowLogin(false);
                  navigate("/auth?mode=register");
                }}
              />
            ) : (
              <Register
                onSwitchToLogin={() => {
                  setShowLogin(true);
                  navigate("/auth?mode=login");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
