// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import LandingPage from "./pages/LandingPage";
import GalleryPage from "./pages/GalleryPage";
import UploadPage from "./pages/UploadPage";
import ActivityPage from "./pages/ActivityPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";

import AppNavbar from "./components/AppNavbar";
import Dashboard from "./components/Dashboard";

function ProtectedShell() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="app-shell">
      <AppNavbar />
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected */}
        <Route element={<ProtectedShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
