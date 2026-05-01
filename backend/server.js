import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import energyRoutes from "./routes/energyRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import emissionRoutes from "./routes/emissionRoutes.js"; // ✅ ADDED

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        origin.includes("localhost") ||
        origin.includes("netlify.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"));
    },
    credentials: true,
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

// 🔓 AUTH (public)
app.use("/api/auth", authRoutes);

// 🔐 ENERGY (protected internally)
app.use("/api/energy", energyRoutes);

// 🔐 DEVICES (protected internally)
app.use("/api/devices", deviceRoutes);

// 🔐 EMISSIONS (protected internally)
app.use("/api/emissions", emissionRoutes); // ✅ ADDED

/* =========================
   HEALTH CHECK (IMPORTANT)
========================= */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

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
