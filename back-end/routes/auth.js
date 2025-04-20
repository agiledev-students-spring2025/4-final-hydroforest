// routes/auth.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Create this in a sec

const User = require('../database/User'); // Your Mongoose User model
require('dotenv').config(); // Load env variables


// SIGNUP Endpoint
router.post(
  '/signup',
  [
    // Validate input fields
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return the first validation error message
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      let { username, email, password } = req.body;
      username = username.trim();
      email = email.trim();

      // Check if a user with the same username or email exists
      let existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Hash the password before storing it
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create and save a new user
      let user = new User({
        username,
        email,
        password: hashedPassword,
        hydrationData: [],
        hasUnlockedTree: false,
        unlockableTrees: ["Misty Bonsai", "Sunflower", "Golden Sun"],
        plantLevel: 0,
        longestStreak: 0,
        currentStreak: 0,
        totalWaterLogged: 0,
        notificationsEnabled: false,  // Using a Boolean per schema
      });

      await user.save();

      // Generate a JWT token for the new user
      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Return a successful signup response
      return res.status(200).json({ success: true, token, message: 'Signup successful!' });
    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// LOGIN Endpoint
router.post(
  '/login',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const { username, password } = req.body;
      let user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ success: true, token, message: 'Login successful!' });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// FORGOT PASSWORD Endpoint (stub)
router.post('/forgot-password', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'If this email is registered, you will receive a password reset link.'
  });
});

// GET /me - returns current logged-in user's full data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude hashed password
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Fetch user error:", err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
