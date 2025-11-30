// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ---------- Middleware ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // allow your frontend
    credentials: true,
  })
);

// Static folder for encrypted files (for downloads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Routes ----------
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/image");

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// Simple health check (optional but nice for Render)
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Secure Photo Vault API running" });
});

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
