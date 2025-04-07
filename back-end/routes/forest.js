const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data.json");

const readData = () => JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

router.get("/", (req, res) => {
  const data = readData();
  res.json(data); // ✅ send entire data object
});

module.exports = router;
