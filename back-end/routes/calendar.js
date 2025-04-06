const express = require('express');
const router = express.Router();
const fs = require('fs');

// GET hydration data for the entire month of April
router.get('/', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./data.json'));
    res.json(data.hydrationData); // Send all hydration data for April
});

// POST new hydration log (just logs to console or updates file if you want)
router.post('/', (req, res) => {
  const { date, cups } = req.body;
  console.log(`Received hydration data: ${date}, ${cups}`);
  res.json({ success: true, message: "Mock hydration data received." });
});

module.exports = router;
