// routes/auth.js
const express = require('express');
const router = express.Router();

const users = [
  { username: 'testuser', email: 'test@example.com', password: '1234' }
];

// LOGIN
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login request received:', req.body); // ✅ Add this line

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ success: true, message: 'Login successful!' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  console.log('Signup request received:', req.body); // ✅ Add this line

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const exists = users.find(u => u.username === username || u.email === email);
  if (exists) {
    return res.status(409).json({ success: false, message: 'User already exists' });
  }

  users.push({ username, email, password });
  res.json({ success: true, message: 'Signup successful!' });
});


// FORGOT PASSWORD
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // Always return success for privacy reasons
  res.json({
    success: true,
    message: 'If this email is registered, you will receive a password reset link.'
  });
});

module.exports = router;
