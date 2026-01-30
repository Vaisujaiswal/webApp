import express from "express";
import Energy from "../models/EnergyUsage.js";

const router = express.Router();

/* =========================
   GET TODAY'S ENERGY DATA
   (Protected by verifyToken)
========================= */
router.get("/today", async (req, res) => {
  try {
    const userId = req.user.id; // set by authMiddleware

    const data = await Energy.find({ user: userId });

    return res.status(200).json(data);
  } catch (error) {
    console.error("ENERGY TODAY ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch energy data",
    });
  }
});

export default router;
