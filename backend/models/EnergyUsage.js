import mongoose from "mongoose";

/* =========================
   ENERGY USAGE SCHEMA
========================= */
const energySchema = new mongoose.Schema(
  {
    /* =========================
       OWNER
    ========================= */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =========================
       TIME DIMENSION
       (Hour-wise data for charts)
    ========================= */
    hour: {
      type: Number, // 0–23 (BEST for charts)
      required: true,
      min: 0,
      max: 23,
      index: true,
    },

    /* =========================
       ENERGY METRICS
    ========================= */
    usage: {
      type: Number, // kWh
      required: true,
      min: 0,
    },

    cost: {
      type: Number, // ₹
      required: true,
      min: 0,
    },

    /* =========================
       SOURCE DEVICE (OPTIONAL)
    ========================= */
    device: {
      type: String, // device name
      trim: true,
    },

    /* =========================
       DATE (DAY-LEVEL GROUPING)
    ========================= */
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

/* =========================
   COMPOUND INDEXES
   (Performance – senior stuff)
========================= */
energySchema.index({ user: 1, date: 1, hour: 1 });

export default mongoose.model("EnergyUsage", energySchema);
