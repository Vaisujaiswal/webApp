import express from "express";
import mongoose from "mongoose";
import Energy from "../models/EnergyUsage.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { generateTodayEnergyUsage } from "../services/energySimulator.js";

const router = express.Router();

/* =================================================
   CONSTANTS (INDIA-FOCUSED)
================================================= */
const EMISSION_FACTOR = 0.82;
const KM_PER_KG_CO2 = 4.3;
const KG_CO2_PER_TREE = 21;

/* =================================================
   GET MONTHLY EMISSIONS SUMMARY
================================================= */
router.get("/summary", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // ✅ VERY IMPORTANT
        // Ensure energy exists (same as dashboard)
        await generateTodayEnergyUsage(userId);

        /* =========================
           DATE RANGE (THIS MONTH)
        ========================= */
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setMilliseconds(-1);

        /* =========================
           AGGREGATE MONTHLY USAGE
        ========================= */
        const monthlyAgg = await Energy.aggregate([
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

        const monthlyUnits = Number(
            (monthlyAgg[0]?.totalUnits || 0).toFixed(2)
        );

        /* =========================
           CALCULATIONS
        ========================= */
        const totalCO2 = monthlyUnits * EMISSION_FACTOR;
        const drivingKm = totalCO2 * KM_PER_KG_CO2;
        const treesNeeded = Math.ceil(totalCO2 / KG_CO2_PER_TREE);

        /* =========================
           LAST 4 MONTH TREND
        ========================= */
        const trend = [];

        for (let i = 3; i >= 0; i--) {
            const start = new Date();
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            start.setMonth(start.getMonth() - i);

            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            end.setMilliseconds(-1);

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

        /* =========================
           AI TIPS
        ========================= */
        const aiTips = [];

        if (monthlyUnits > 150) {
            aiTips.push({ text: "Reduce AC usage by 1 hour per day", impactKg: 6 });
        }

        if (monthlyUnits > 100) {
            aiTips.push({ text: "Switch frequently used lights to LEDs", impactKg: 3 });
        }

        aiTips.push({
            text: "Turn off devices at the wall instead of standby",
            impactKg: 2,
        });

        return res.status(200).json({
            monthlyUnits,
            totalCO2: Number(totalCO2.toFixed(1)),
            drivingKm: Number(drivingKm.toFixed(0)),
            treesNeeded,
            emissionFactor: EMISSION_FACTOR,
            trend,
            aiTips,
        });
    } catch (error) {
        console.error("EMISSIONS SUMMARY ERROR:", error);
        return res.status(500).json({
            message: "Failed to calculate emissions",
        });
    }
});

export default router;
