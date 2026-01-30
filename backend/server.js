import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import energyRoutes from "./routes/energyRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);

// 🔐 PROTECTED ROUTES
app.use("/api/energy", verifyToken, energyRoutes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
