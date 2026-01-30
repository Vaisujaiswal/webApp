import Energy from "../models/EnergyUsage.js";
import mongoose from "mongoose";
import { generateTodayEnergyUsage } from "../services/energySimulator.js";

/* =================================================
   ENSURE TODAY ENERGY MIDDLEWARE
   Runs ONCE per day per user
   Devices ➜ EnergyUsage ➜ Dashboard / Charts
================================================= */

const ensureTodayEnergy = async (req, res, next) => {
  try {
    // 🔐 user is already verified by verifyToken
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: user not found",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    /* =========================
       TODAY RANGE
    ========================= */
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    /* =========================
       CHECK IF DATA EXISTS
    ========================= */
    const alreadyExists = await Energy.findOne({
      user: userObjectId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).lean();

    if (!alreadyExists) {
      // 🧠 Generate energy ONLY ONCE per day
      await generateTodayEnergyUsage(userId);
    }

    next();
  } catch (error) {
    console.error("ENSURE TODAY ENERGY ERROR:", error);
    next(error);
  }
};

export default ensureTodayEnergy;
