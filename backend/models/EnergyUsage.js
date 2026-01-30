const mongoose = require("mongoose");

const energySchema = new mongoose.Schema({
  hour: String,
  usage: Number,
  cost: Number,
  device: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("EnergyUsage", energySchema);
