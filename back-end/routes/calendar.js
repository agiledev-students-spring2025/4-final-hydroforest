const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../database/User');

// GET hydration data for the logged-in user
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ hydrationData: user.hydrationData });
  } catch (err) {
    console.error("Calendar fetch error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
