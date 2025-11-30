// frontend/src/api.js
import axios from "axios";

// Base URL for backend
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://secure-photo-vault.onrender.com/api" // Render backend
    : "http://localhost:5000/api";                  // Local dev

const API = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    // for our authMiddleware that might read either header
    config.headers["x-auth-token"] = token;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
