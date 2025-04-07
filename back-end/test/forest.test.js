const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFilePath = path.join(__dirname, '../mock-data/data.json');

// GET hydration data for the entire month (or all hydrationData)
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const jsonData = JSON.parse(data);
    res.json({ hydrationData: jsonData.hydrationData });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).json({ error: "Failed to read file" });
  }
});

// POST new hydration log (mock endpoint)
router.post('/', (req, res) => {
  const { date, cups } = req.body;
  console.log(`Received hydration data: ${date}, ${cups}`);
  res.json({ success: true, message: "Mock hydration data received." });
});

module.exports = router;


