const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/energy", require("./routes/energyRoutes"));


mongoose
  .connect("mongodb://127.0.0.1:27017/smartenergy")
  .then(() => console.log("MongoDB Connected"));

app.get("/", (req, res) => {
  res.send("Smart Energy Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
