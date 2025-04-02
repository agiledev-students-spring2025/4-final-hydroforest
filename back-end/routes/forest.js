const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data.json");

const readData = () => JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

// GET Forest Data
router.get("/", (req, res) => {
  const data = readData();
  res.json({ success: true, unlockedTrees: data.unlockedTrees, fullyGrownTrees: data.fullyGrownTrees });
});

module.exports = router;