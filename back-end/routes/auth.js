// routes/auth.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Define the path to your JSON data file
const dataFilePath = path.join(__dirname, '../mock-data/data.json');

// Utility function to load users from data.json
function loadUsers() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    let users = JSON.parse(data);
    // Ensure we work with an array
    if (!Array.isArray(users)) {
      users = [users];
    }
    return users;
  } catch (err) {
    console.error("Error reading data file:", err);
    return [];
  }
}

// Utility function to save users to data.json
function saveUsers(users) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing to data file:", err);
  }
}

// Initialize our users array from the file
let users = loadUsers();

// LOGIN
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login request received:', req.body);

  // Reload users in case the file has changed
  users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ success: true, message: 'Login successful!' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// SIGNUP
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  console.log('Signup request received:', req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  

  users = loadUsers();
  const exists = users.find(u => u.username === username || u.email === email);
  if (exists) {
    return res.status(409).json({ success: false, message: 'User already exists' });
  }

  
  const newUser = {
    username,
    email,
    password,
    hydrationData: [],                  
    todayHydration: 0,                  
    hasUnlockedTree: false,            
    unlockedTrees: [],                 
    unlockableTrees: ["Misty Bonsai", "tree2", "tree3"] 
  };

  // users.push(newUser);

  // // Persist the updated users array to the file
  // saveUsers(users);

  res.json({ success: true, message: 'Signup successful!' });
});

// FORGOT PASSWORD
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // For security, always respond with success without confirming email existence
  res.json({
    success: true,
    message: 'If this email is registered, you will receive a password reset link.'
  });
});

module.exports = router;
