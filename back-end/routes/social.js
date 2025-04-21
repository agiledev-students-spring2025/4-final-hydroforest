const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../database/User');
const { body, query, validationResult } = require('express-validator');

// GET all friends for the authenticated user
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'username totalWaterLogged');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ friends: user.friends });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch friends.' });
  }
});

// GET friend suggestions based on query
router.get(
  '/suggestions',
  passport.authenticate('jwt', { session: false }),
  [
    query('q')
      .optional()
      .isString()
      .isLength({ max: 20 })
      .withMessage('Query must be a string no longer than 20 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const query = req.query.q?.toLowerCase() || '';
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const allUsers = await User.find({ _id: { $ne: user._id } });

      const suggestions = allUsers.filter(u =>
        u.username.toLowerCase().includes(query) &&
        !user.friends.includes(u._id)
      );
      if (suggestions.length === 0) {
        return res.json({ suggestions: [], message: 'No Users Found' });
      }
      res.json({ suggestions });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch suggestions.' });
    }
  }
);

// POST to add a friend
router.post(
  '/add',
  passport.authenticate('jwt', { session: false }),
  [
    body('friendId')
      .isString()
      .withMessage('friendId is required and must be a string')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { friendId } = req.body;

    try {
      const user = await User.findById(req.user.id);
      const friend = await User.findById(friendId);

      if (!user || !friend) return res.status(404).json({ error: 'User or friend not found' });

      if (!user.friends.includes(friend._id)) {
        user.friends.push(friend._id);
        await user.save();
      }

      res.json({ success: true, message: 'Friend added.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add friend.' });
    }
  }
);

// POST to remove a friend
router.post(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  [
    body('friendId')
      .isString()
      .withMessage('friendId is required and must be a string')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { friendId } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      user.friends = user.friends.filter(fId => fId.toString() !== friendId);
      await user.save();

      res.json({ success: true, message: 'Friend removed.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove friend.' });
    }
  }
);

module.exports = router;

