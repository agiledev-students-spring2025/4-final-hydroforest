const express = require('express');
const router = express.Router();

// Use the shared in-memory data from data.json
const userData = require('../mock-data/data.json');

// GET hydration data for the entire month (or all hydrationData)
router.get('/', (req, res) => {
  res.json({ hydrationData: userData.hydrationData });
});

// POST new hydration log (mock endpoint)
router.post('/', (req, res) => {
  const { date, cups } = req.body;
  console.log(`Received hydration data: ${date}, ${cups}`);
  res.json({ success: true, message: "Mock hydration data received." });
});

module.exports = router;
