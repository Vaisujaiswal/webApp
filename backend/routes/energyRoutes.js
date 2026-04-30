import express from "express";
import mongoose from "mongoose";
import Energy from "../models/EnergyUsage.js";
import Device from "../models/Device.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import ensureTodayEnergy from "../middleware/ensureTodayEnergy.js";

// ✅ Cache
import { getCache, setCache } from "../utils/cache.js";

const router = express.Router();

/* =========================
   GET TODAY'S RAW ENERGY DATA
   (Hour-wise for charts)
========================= */
router.get(
  "/today",
  verifyToken,
  ensureTodayEnergy,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const cacheKey = `energy:today:${userId}`;

      // 🔁 Cache check
      const cached = getCache(cacheKey);
      if (cached) {
        return res.status(200).json(cached);
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const data = await Energy.find({
        user: userObjectId,
        date: { $gte: startOfDay, $lte: endOfDay },
      })
        .sort({ date: 1 })
        .lean();

      // Cache for charts (short TTL)
      setCache(cacheKey, data, 30);

      return res.status(200).json(data);
    } catch (error) {
      console.error("ENERGY TODAY ERROR:", error);
      return res.status(500).json({
        message: "Failed to fetch energy data",
      });
    }
  }
);

/* =========================
   DASHBOARD SUMMARY
   (Stats + AI signals)
========================= */
router.get(
  "/summary",
  verifyToken,
  ensureTodayEnergy,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const cacheKey = `energy:summary:${userId}`;

      // 🔁 Cache check
      const cached = getCache(cacheKey);
      if (cached) {
        return res.status(200).json(cached);
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      /* =========================
         ENERGY AGGREGATION
      ========================= */
      const energyAgg = await Energy.aggregate([
        {
          $match: {
            user: userObjectId,
            date: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            totalUsage: { $sum: "$usage" },
            totalCost: { $sum: "$cost" },
          },
        },
      ]);

      const usageToday = energyAgg[0]?.totalUsage || 0;
      const totalCost = energyAgg[0]?.totalCost || 0;

      /* =========================
         DEVICE ANALYSIS
      ========================= */
      const devices = await Device.find({
        user: userObjectId,
        isActive: true,
      }).lean();

      let estimatedDeviceUsage = 0;
      let acUsage = 0;
      let idleDevices = 0;

      devices.forEach((device) => {
        const dailyEnergy =
          (device.power * device.hoursPerDay) / 1000;

        estimatedDeviceUsage += dailyEnergy;

        if (device.category === "AC") {
          acUsage += dailyEnergy;
        }

        if (device.power > 100 && device.hoursPerDay < 1) {
          idleDevices++;
        }
      });

      /* =========================
         EFFICIENCY
      ========================= */
      let efficiency = 100;

      if (estimatedDeviceUsage > 0) {
        efficiency = Math.round(
          (usageToday / estimatedDeviceUsage) * 100
        );
      }

      efficiency = Math.max(0, Math.min(100, efficiency));

      /* =========================
         AI SIGNALS
      ========================= */
      const usageSignals = {
        acUsageHigh:
          usageToday > 0 &&
          acUsage / usageToday > 0.4,

        idleDevicesDetected: idleDevices > 0,

        nightUsageHigh:
          estimatedDeviceUsage > 0 &&
          usageToday > estimatedDeviceUsage * 0.9,
      };

      const response = {
        totalCost: Math.round(totalCost),
        usageToday: Number(usageToday.toFixed(2)),
        efficiency,
        deviceCount: devices.length,
        usageSignals,
      };

      // Cache dashboard summary (stable data)
      setCache(cacheKey, response, 60);

      return res.status(200).json(response);
    } catch (error) {
      console.error("ENERGY SUMMARY ERROR:", error);
      return res.status(500).json({
        message: "Failed to fetch dashboard summary",
      });
    }
  }
);

export default router;
