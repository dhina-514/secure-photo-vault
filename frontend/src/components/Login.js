import React, { useState } from "react";
import API from "../api";

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await API.post("/auth/login", { email, password });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);

      setMessage("");
      onLoginSuccess();
    } catch (err) {
      console.error("Login error:", err);
      const apiMsg = err.response?.data?.message;
      setMessage(apiMsg || "Error logging in. Check backend is running.");
    }
  }

  return (
    <div>
      <h2 className="h4 text-center mb-1">Secure Photo Vault</h2>
      <p className="text-muted text-center mb-4">
        Login to access your encrypted photos.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control form-control-sm bg-dark text-light border-secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control form-control-sm bg-dark text-light border-secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 btn-sm">
          Login
        </button>
      </form>

      {message && (
        <div className="mt-3 text-center">
          <small className="text-warning">{message}</small>
        </div>
      )}

      <p className="mt-4 text-center text-muted small">
        No account?{" "}
        <button
          type="button"
          className="btn btn-link p-0 align-baseline"
          onClick={onSwitchToRegister}
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;
