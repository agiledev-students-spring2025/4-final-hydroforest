const express = require('express');
const router = express.Router();
const User = require('../database/User');

// GET top users by total water logged (leaderboard)
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends', 'username totalWaterLogged');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Return friends sorted by totalWaterLogged
    const sortedFriends = [...user.friends].sort((a, b) => b.totalWaterLogged - a.totalWaterLogged);
    res.json({ leaderboard: sortedFriends });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

module.exports = router;
