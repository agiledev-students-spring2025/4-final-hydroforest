const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../database/User');

// GET /api/leaderboard — returns leaderboard of current user's friends
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'friends',
      select: 'username totalWaterLogged'
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Construct the user's own leaderboard entry
    const self = {
      _id: user._id,
      username: user.username,
      totalWaterLogged: user.totalWaterLogged,
      isSelf: true
    };

    // Combine the user and friends into one array
    const combined = [...user.friends, self];

    // Sort by water logged (highest to lowest)
    const leaderboard = combined.sort((a, b) => b.totalWaterLogged - a.totalWaterLogged);


    res.json({ leaderboard });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
