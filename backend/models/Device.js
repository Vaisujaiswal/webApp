// import mongoose from "mongoose";

// /* =========================
//    DEVICE SCHEMA
// ========================= */
// const deviceSchema = new mongoose.Schema(
//   {
//     // 🔐 Owner
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     // 📟 Device name
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 50,
//     },

//     // ⚡ Power in Watts
//     power: {
//       type: Number,
//       required: true,
//       min: 1,
//     },

//     // ⏱️ Hours used per day
//     hoursPerDay: {
//       type: Number,
//       required: true,
//       min: 0,
//       max: 24,
//     },

//     // 🔌 Category (AI-ready)
//     category: {
//       type: String,
//       enum: [
//         "AC",
//         "FAN",
//         "LIGHT",
//         "TV",
//         "FRIDGE",
//         "WASHING_MACHINE",
//         "OTHER",
//       ],
//       default: "OTHER",
//     },

//     // 🧠 AI flags (future use)
//     aiFlags: {
//       highConsumption: { type: Boolean, default: false },
//       nightUsage: { type: Boolean, default: false },
//       inefficient: { type: Boolean, default: false },
//     },

//     // 🔕 Soft delete
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// /* =========================
//    VIRTUALS (NO DB STORAGE)
// ========================= */

// // Daily energy usage (kWh)
// deviceSchema.virtual("dailyEnergy").get(function () {
//   return Number(((this.power * this.hoursPerDay) / 1000).toFixed(2));
// });

// // Monthly energy usage (kWh)
// deviceSchema.virtual("monthlyEnergy").get(function () {
//   return Number(((this.power * this.hoursPerDay * 30) / 1000).toFixed(2));
// });

// // Include virtuals in JSON
// deviceSchema.set("toJSON", { virtuals: true });
// deviceSchema.set("toObject", { virtuals: true });

// /* =========================
//    INDEXES
// ========================= */
// deviceSchema.index({ user: 1, isActive: 1 });

// /* =========================
//    EXPORT (CRITICAL)
// ========================= */
// const Device = mongoose.model("Device", deviceSchema);
// export default Device;

































import mongoose from "mongoose";

/* =========================
   DEVICE SCHEMA
========================= */
const deviceSchema = new mongoose.Schema(
  {
    // 🔐 Owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 📟 Device name
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    // ⚡ Power per device (Watts)
    power: {
      type: Number,
      required: true,
      min: 1,
    },

    // 🔢 Number of devices
    count: {
      type: Number,
      default: 1,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Count must be an integer",
      },
    },

    // ⏱️ Hours used per day
    hoursPerDay: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },

    // 🔌 Category (AI-ready)
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
    },

    // 🧠 AI flags (future use)
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
   VIRTUALS (AUTO FIX ALL CALCS)
========================= */

// Daily energy usage (kWh)
deviceSchema.virtual("dailyEnergy").get(function () {
  return Number(
    (
      (this.power * this.count * this.hoursPerDay) /
      1000
    ).toFixed(2)
  );
});

// Monthly energy usage (kWh)
deviceSchema.virtual("monthlyEnergy").get(function () {
  return Number(
    (
      (this.power * this.count * this.hoursPerDay * 30) /
      1000
    ).toFixed(2)
  );
});

// Include virtuals in JSON
deviceSchema.set("toJSON", { virtuals: true });
deviceSchema.set("toObject", { virtuals: true });

/* =========================
   INDEXES
========================= */
deviceSchema.index({ user: 1, isActive: 1 });

/* =========================
   EXPORT
========================= */
const Device = mongoose.model("Device", deviceSchema);
export default Device;
