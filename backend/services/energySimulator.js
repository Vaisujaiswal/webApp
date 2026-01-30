import Energy from "../models/EnergyUsage.js";
import Device from "../models/Device.js";
import mongoose from "mongoose";

/* =================================================
   ENERGY SIMULATOR SERVICE
   Devices ➜ EnergyUsage ➜ Dashboard / Charts / AI
================================================= */

/**
 * Generate today's energy usage from devices
 * @param {string} userId
 */
export const generateTodayEnergyUsage = async (userId) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    /* =========================
       DATE RANGE (TODAY)
    ========================= */
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    /* =========================
       PREVENT DUPLICATE DATA
    ========================= */
    const alreadyGenerated = await Energy.findOne({
        user: userObjectId,
        date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (alreadyGenerated) return;

    /* =========================
       FETCH ACTIVE DEVICES
    ========================= */
    const devices = await Device.find({
        user: userObjectId,
        isActive: true,
    });

    if (devices.length === 0) return;

    /* =========================
       GENERATE ENERGY DATA
    ========================= */
    const energyEntries = [];
    const TARIFF = 7; // ₹ per kWh

    devices.forEach((device) => {
        const power = device.power; // watts
        const hoursPerDay = Math.min(Math.max(device.hoursPerDay, 0), 24);

        if (hoursPerDay === 0) return;

        const hourlyUsage = power / 1000; // kWh per hour
        const totalHours = Math.ceil(hoursPerDay);

        /**
         * Smart start hour:
         * - Heavy devices → evening
         * - Light devices → spread
         */
        let baseStartHour =
            power > 1000
                ? 18 // AC, geyser, etc.
                : 9; // lights, fans, TV

        // Add slight variation per device
        baseStartHour += Math.floor(Math.random() * 3); // +0 to +2

        for (let i = 0; i < totalHours; i++) {
            const hour = baseStartHour + i;
            if (hour > 23) break;

            const entryDate = new Date(startOfDay);
            entryDate.setHours(hour, 0, 0, 0);

            energyEntries.push({
                user: userObjectId,
                hour, // 0–23 (numeric)
                usage: Number(hourlyUsage.toFixed(3)),
                cost: Number((hourlyUsage * TARIFF).toFixed(2)),
                device: device.name,
                date: entryDate, // ✅ correct hour timestamp
            });
        }
    });

    /* =========================
       SAVE TO DATABASE
    ========================= */
    if (energyEntries.length > 0) {
        await Energy.insertMany(energyEntries);
    }
};
