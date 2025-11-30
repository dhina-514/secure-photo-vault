const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS — allow Render + Vercel frontend
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Static folder for encrypted files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/image");

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// Serve frontend build (optional - if using single deployment server)
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "..", "frontend", "build"))
  );

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "frontend", "build", "index.html")
    );
  });
}

// Mongo DB Connect & Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
