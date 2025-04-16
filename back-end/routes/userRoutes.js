const express = require('express');
const router = express.Router();
const User = require('../database/User');

// GET all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Add more routes here later (register, login, update hydration, etc.)

module.exports = router;
