const express = require("express");
const router = express.Router();
const Energy = require("../models/EnergyUsage");

router.get("/today", async (req, res) => {
  const data = await Energy.find();
  res.json(data);
});

module.exports = router;
