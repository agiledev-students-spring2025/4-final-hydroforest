const express = require('express');
const router = express.Router();
const User = require('../database/User');

// GET /api/leaderboard/:userId
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: 'friends',
      select: 'username totalWaterLogged'
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const leaderboard = user.friends.sort(
      (a, b) => b.totalWaterLogged - a.totalWaterLogged
    );

    res.json({ leaderboard });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
