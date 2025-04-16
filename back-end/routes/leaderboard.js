const express = require('express');
const router = express.Router();
const User = require('../database/User');

// GET top users by total water logged (leaderboard)
router.get('/', async (req, res) => {
  try {
    const leaderboard = await User.find({}, 'username totalWaterLogged')
      .sort({ totalWaterLogged: -1 })
      .limit(10); // top 10

    res.json({ leaderboard });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

module.exports = router;
