import React, { useState } from "react";
import API from "../api";

function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { email, password });
      setMessage(res.data.message || "Registered successfully");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error registering");
    }
  }

  return (
    <div>
      <h2 className="h4 text-center mb-1">Create an account</h2>
      <p className="text-muted text-center mb-4">
        Your photos will be encrypted before they ever leave your device.
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
          Register
        </button>
      </form>

      {message && (
        <div className="mt-3 text-center">
          <small className="text-success">{message}</small>
        </div>
      )}

      <p className="mt-4 text-center text-muted small">
        Already have an account?{" "}
        <button
          type="button"
          className="btn btn-link p-0 align-baseline"
          onClick={onSwitchToLogin}
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;
