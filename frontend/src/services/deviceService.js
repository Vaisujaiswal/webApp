import mongoose from "mongoose";

/* =========================
   DEVICE SCHEMA
========================= */
const deviceSchema = new mongoose.Schema(
    {
        // 🔐 Owner of the device
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // 📟 Device name (AC, Fan, TV, etc.)
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        // ⚡ Power rating in Watts
        power: {
            type: Number,
            required: true,
            min: 1,
        },

        // ⏱️ Avg daily usage (hours/day)
        hoursPerDay: {
            type: Number,
            required: true,
            min: 0,
            max: 24,
        },

        // 🔌 Device category (AI ready)
        category: {
            type: String,
            enum: [
                "AC",
                "FAN",
                "LIGHT",
                "TV",
                "FRIDGE",
                "WASHING_MACHINE",
                "OTHER",
            ],
            default: "OTHER",
            uppercase: true,
            trim: true,
        },

        // 🧠 AI flags (derived, not user-input)
        aiFlags: {
            highConsumption: { type: Boolean, default: false },
            nightUsage: { type: Boolean, default: false },
            inefficient: { type: Boolean, default: false },
        },

        // 🔕 Soft delete
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

/* =========================
   VIRTUALS (NO DB STORAGE)
========================= */

// Daily energy usage in kWh
deviceSchema.virtual("dailyEnergy").get(function () {
    return (this.power * this.hoursPerDay) / 1000;
});

// Monthly energy usage (30 days)
deviceSchema.virtual("monthlyEnergy").get(function () {
    return (this.power * this.hoursPerDay * 30) / 1000;
});

// Ensure virtuals are returned in JSON
deviceSchema.set("toJSON", { virtuals: true });
deviceSchema.set("toObject", { virtuals: true });

/* =========================
   AI FLAGS AUTO-CALCULATION
========================= */
deviceSchema.pre("save", function (next) {
    const dailyEnergy = (this.power * this.hoursPerDay) / 1000;

    // High consumption device
    this.aiFlags.highConsumption = dailyEnergy > 3; // >3 kWh/day

    // Inefficient usage
    this.aiFlags.inefficient =
        this.power > 1500 && this.hoursPerDay > 6;

    // Night usage heuristic
    this.aiFlags.nightUsage = this.hoursPerDay >= 8;

    next();
});

/* =========================
   INDEXES (PERFORMANCE)
========================= */
deviceSchema.index({ user: 1, isActive: 1 });

export default mongoose.model("Device", deviceSchema);
