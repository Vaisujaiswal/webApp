import mongoose from "mongoose";

const energySchema = new mongoose.Schema(
  {
    /* =========================
       OWNER (VERY IMPORTANT)
    ========================= */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =========================
       ENERGY DATA
    ========================= */
    hour: {
      type: String, // e.g. "14:00"
      required: true,
    },

    usage: {
      type: Number, // kWh
      required: true,
    },

    cost: {
      type: Number, // ₹
      required: true,
    },

    device: {
      type: String,
      trim: true,
    },

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

export default mongoose.model("EnergyUsage", energySchema);
