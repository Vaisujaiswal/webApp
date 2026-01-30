import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        /* =========================
           COMMON FIELDS
        ========================= */
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
            index: true,
        },

        password: {
            type: String,
            required: true,
            select: false, // 🔐 NEVER return password by default
        },

        role: {
            type: String,
            enum: ["home", "industry", "discom"],
            required: true,
        },

        /* =========================
           HOME USER
        ========================= */
        city: {
            type: String,
            trim: true,
        },
        houseType: String,
        provider: String,
        monthlyUnits: {
            type: Number,
            default: 0,
        },

        /* =========================
           INDUSTRY USER
        ========================= */
        industryName: String,
        industryType: String,
        shifts: String,

        /* =========================
           DISCOM
        ========================= */
        orgName: String,
        designation: String,
        region: String,
    },
    {
        timestamps: true,
        strict: true, // ❌ reject unknown fields
    }
);

export default mongoose.model("User", userSchema);
