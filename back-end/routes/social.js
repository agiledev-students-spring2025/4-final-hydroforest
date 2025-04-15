const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Friend = require('../models/Friend');
const User = require('../models/User');

// GET all current friends
router.get('/', async (req, res) => {
  try {
    const friends = await Friend.find();
    res.json({ friends });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch friends.' });
  }
});

// GET friend suggestions based on query
router.get('/suggestions', async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || '';
    const allUsers = await User.find();
    const friends = await Friend.find();

    const suggestions = allUsers.filter(
      user =>
        user.name.toLowerCase().includes(query) &&
        !friends.some(f => f.name === user.name)
    );

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch suggestions.' });
  }
});

// POST to add a friend
router.post('/add',
  body('name').notEmpty(),
  body('hydration').isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, hydration, src } = req.body;
      const exists = await Friend.findOne({ name });

      if (!exists) {
        await Friend.create({ name, hydration, src });
      }

      res.json({ success: true, message: 'Friend added.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add friend.' });
    }
  }
);

// POST to remove a friend by ID
router.post('/remove',
  body('id').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await Friend.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: 'Friend removed.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove friend.' });
    }
  }
);

module.exports = router;




/*
const express = require('express');
const router = express.Router();

// In-memory friend data
let friends = [
  { id: 1, name: 'Alice', hydration: 7.5, src: 'https://picsum.photos/101' },
  { id: 2, name: 'Bob', hydration: 6.2, src: 'https://picsum.photos/102' },
  { id: 3, name: 'Charlie', hydration: 8.0, src: 'https://picsum.photos/103' }
];

const allUsers = [
  { id: 4, name: 'David', hydration: 2, src: 'https://picsum.photos/104' },
  { id: 5, name: 'Eva', hydration: 1, src: 'https://picsum.photos/105' },
  { id: 6, name: 'Frank', hydration: 5, src: 'https://picsum.photos/106' }
];

// GET all current friends
router.get('/', (req, res) => {
  res.json({ friends });
});

// GET friend suggestions based on query
router.get('/suggestions', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const suggestions = allUsers.filter(
    user =>
      user.name.toLowerCase().includes(query) &&
      !friends.some(f => f.id === user.id)
  );
  res.json({ suggestions });
});

// POST to add a friend
router.post('/add', (req, res) => {
  const newFriend = req.body;
  if (!friends.some(f => f.id === newFriend.id)) {
    friends.push(newFriend);
  }
  res.json({ success: true, message: 'Friend added.' });
});

// POST to remove a friend by ID
router.post('/remove', (req, res) => {
  const { id } = req.body;
  friends = friends.filter(f => f.id !== id);
  res.json({ success: true, message: 'Friend removed.' });
});

module.exports = router;
*/