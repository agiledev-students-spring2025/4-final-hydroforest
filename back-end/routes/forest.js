const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data.json");

// Function to read the data from the file
const readData = () => JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

// Endpoint to get the data from the file
router.get("/", (req, res) => {
  try {
    const data = readData();
    res.json(data); // Send the data object as a response
  } catch (error) {
    res.status(500).json({ error: "Failed to read file" }); // Handle errors (e.g., file not found)
  }
});

module.exports = router;
