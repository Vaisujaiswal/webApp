import Energy from "../models/EnergyUsage.js";
import mongoose from "mongoose";

/* =================================================
   EMISSION ENGINE (Single Source of Truth)
================================================= */

// India grid average (coal dominant)
const EMISSION_FACTOR = 0.82; // kg CO₂ / kWh
const KM_PER_KG_CO2 = 4.3;
const KG_CO2_PER_TREE = 21;

/**
 * Calculate monthly emission data for a user
 * @param {string} userId
 */
export const calculateMonthlyEmissions = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  /* =========================
     DATE RANGE (THIS MONTH)
  ========================= */
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setHours(23, 59, 59, 999);

  /* =========================
     AGGREGATE ENERGY USAGE
  ========================= */
  const result = await Energy.aggregate([
    {
      $match: {
        user: userObjectId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalUnits: { $sum: "$usage" },
      },
    },
  ]);

  const monthlyUnits = Number((result[0]?.totalUnits || 0).toFixed(2));

  /* =========================
     EMISSION CALCULATIONS
  ========================= */
  const totalCO2 = monthlyUnits * EMISSION_FACTOR;
  const drivingKm = totalCO2 * KM_PER_KG_CO2;
  const treesNeeded = Math.ceil(totalCO2 / KG_CO2_PER_TREE);

  return {
    monthlyUnits,
    totalCO2: Number(totalCO2.toFixed(1)),
    drivingKm: Number(drivingKm.toFixed(0)),
    treesNeeded,
    emissionFactor: EMISSION_FACTOR,
  };
};

/**
 * Generate last 4 months emission trend
 * @param {string} userId
 */
export const generateEmissionTrend = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const trend = [];

  for (let i = 3; i >= 0; i--) {
    const start = new Date();
    start.setMonth(start.getMonth() - i, 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    const agg = await Energy.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          units: { $sum: "$usage" },
        },
      },
    ]);

    const units = agg[0]?.units || 0;

    trend.push({
      month: start.toLocaleString("default", { month: "short" }),
      co2: Number((units * EMISSION_FACTOR).toFixed(1)),
    });
  }

  return trend;
};

/**
 * AI-style emission reduction tips
 * @param {number} monthlyUnits
 */
export const generateEmissionTips = (monthlyUnits) => {
  const tips = [];

  if (monthlyUnits > 150) {
    tips.push({
      text: "Reduce AC usage by 1 hour daily",
      impactKg: 6,
    });
  }

  if (monthlyUnits > 100) {
    tips.push({
      text: "Switch frequently used lights to LEDs",
      impactKg: 3,
    });
  }

  tips.push({
    text: "Turn off devices from main switch instead of standby",
    impactKg: 2,
  });

  return tips;
};
