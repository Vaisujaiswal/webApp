// import express from "express";
// import Device from "../models/Device.js";
// import { verifyToken } from "../middleware/authMiddleware.js";
// // ✅ FIXED: Importing from local backend utils, not frontend
// import { deleteCache } from "../utils/cache.js";

// const router = express.Router();

// /* =========================
//    GET ALL DEVICES (USER)
// ========================= */
// router.get("/", verifyToken, async (req, res) => {
//     try {
//         const devices = await Device.find({
//             user: req.user.id,
//             isActive: true,
//         }).sort({ createdAt: -1 });

//         return res.status(200).json(devices);
//     } catch (error) {
//         console.error("GET DEVICES ERROR:", error);
//         return res.status(500).json({
//             message: "Failed to fetch devices",
//         });
//     }
// });

// /* =========================
//    ADD NEW DEVICE
// ========================= */
// router.post("/", verifyToken, async (req, res) => {
//     try {
//         let { name, power, hours, category } = req.body;

//         /* ---------- Validation ---------- */
//         if (!name || power === undefined || hours === undefined) {
//             return res.status(400).json({
//                 message: "Name, power and hours are required",
//             });
//         }

//         name = name.trim();
//         power = Number(power);
//         hours = Number(hours);

//         if (Number.isNaN(power) || Number.isNaN(hours)) {
//             return res.status(400).json({
//                 message: "Power and hours must be numbers",
//             });
//         }

//         if (power <= 0 || hours < 0 || hours > 24) {
//             return res.status(400).json({
//                 message: "Invalid power or hours value",
//             });
//         }

//         /* ---------- Normalize category ---------- */
//         const normalizedCategory = category
//             ? String(category).toUpperCase()
//             : "OTHER";

//         /* ---------- Create device ---------- */
//         const device = await Device.create({
//             user: req.user.id,
//             name,
//             power,
//             hoursPerDay: hours, // 🔥 correctly mapped to schema
//             category: normalizedCategory,
//             isActive: true,
//         });

//         /* ---------- Cache invalidation ---------- */
//         // We clear these so the dashboard shows fresh data after a new device is added
//         deleteCache(`energy:summary:${req.user.id}`);
//         deleteCache(`energy:today:${req.user.id}`);

//         return res.status(201).json(device);
//     } catch (error) {
//         console.error("ADD DEVICE ERROR:", error);
//         return res.status(500).json({
//             message: "Failed to add device",
//         });
//     }
// });

// /* =========================
//    DELETE DEVICE (SOFT)
// ========================= */
// router.delete("/:id", verifyToken, async (req, res) => {
//     try {
//         const device = await Device.findOne({
//             _id: req.params.id,
//             user: req.user.id,
//             isActive: true,
//         });

//         if (!device) {
//             return res.status(404).json({
//                 message: "Device not found",
//             });
//         }

//         device.isActive = false;
//         await device.save();

//         /* ---------- Cache invalidation ---------- */
//         deleteCache(`energy:summary:${req.user.id}`);
//         deleteCache(`energy:today:${req.user.id}`);

//         return res.status(200).json({
//             message: "Device removed successfully",
//         });
//     } catch (error) {
//         console.error("DELETE DEVICE ERROR:", error);
//         return res.status(500).json({
//             message: "Failed to remove device",
//         });
//     }
// });

// export default router;































import express from "express";
import Device from "../models/Device.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { deleteCache } from "../utils/cache.js";

const router = express.Router();

/* =========================
   GET ALL DEVICES (USER)
========================= */
router.get("/", verifyToken, async (req, res) => {
    try {
        const devices = await Device.find({
            user: req.user.id,
            isActive: true,
        }).sort({ createdAt: -1 });

        return res.status(200).json(devices);
    } catch (error) {
        console.error("GET DEVICES ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch devices",
        });
    }
});

/* =========================
   ADD NEW DEVICE
========================= */
router.post("/", verifyToken, async (req, res) => {
    try {
        let { name, power, hours, count, category } = req.body;

        /* ---------- Basic validation ---------- */
        if (!name || power === undefined || hours === undefined) {
            return res.status(400).json({
                message: "Name, power and hours are required",
            });
        }

        name = name.trim();

        // 🔥 SAFETY NORMALIZATION
        power = Number(power);
        hours = Number(hours);

        // 👉 THIS IS THE REAL FIX
        if (count === "" || count === undefined || count === null) {
            count = 1;
        } else {
            count = Number(count);
        }

        /* ---------- Type validation ---------- */
        if (
            Number.isNaN(power) ||
            Number.isNaN(hours) ||
            Number.isNaN(count)
        ) {
            return res.status(400).json({
                message: "Power, hours and count must be numbers",
            });
        }

        /* ---------- Value validation ---------- */
        if (
            power <= 0 ||
            count < 1 ||
            hours < 0 ||
            hours > 24
        ) {
            return res.status(400).json({
                message: "Invalid power, count or hours value",
            });
        }

        /* ---------- Normalize category ---------- */
        const normalizedCategory = category
            ? String(category).toUpperCase()
            : "OTHER";

        /* ---------- Create device ---------- */
        const device = await Device.create({
            user: req.user.id,
            name,
            power,           // per-device power
            count,           // ✅ always valid now
            hoursPerDay: hours,
            category: normalizedCategory,
            isActive: true,
        });

        /* ---------- Cache invalidation ---------- */
        deleteCache(`energy:summary:${req.user.id}`);
        deleteCache(`energy:today:${req.user.id}`);

        return res.status(201).json(device);
    } catch (error) {
        console.error("ADD DEVICE ERROR:", error);
        return res.status(500).json({
            message: "Failed to add device",
        });
    }
});

/* =========================
   DELETE DEVICE (SOFT)
========================= */
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const device = await Device.findOne({
            _id: req.params.id,
            user: req.user.id,
            isActive: true,
        });

        if (!device) {
            return res.status(404).json({
                message: "Device not found",
            });
        }

        device.isActive = false;
        await device.save();

        deleteCache(`energy:summary:${req.user.id}`);
        deleteCache(`energy:today:${req.user.id}`);

        return res.status(200).json({
            message: "Device removed successfully",
        });
    } catch (error) {
        console.error("DELETE DEVICE ERROR:", error);
        return res.status(500).json({
            message: "Failed to remove device",
        });
    }
});

export default router;
