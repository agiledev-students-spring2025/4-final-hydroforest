// routes/auth.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Define the paths to your JSON data files
const dataFilePath = path.join(__dirname, '../mock-data/data.json');
const newUserFilePath = path.join(__dirname, '../mock-data/newUser.json');

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

// Utility function to load new users from newuser.json
function loadNewUsers() {
  try {
    // If the file doesn't exist, return an empty array.
    if (!fs.existsSync(newUserFilePath)) {
      return [];
    }
    const data = fs.readFileSync(newUserFilePath, 'utf8');
    let newUsers = JSON.parse(data);
    if (!Array.isArray(newUsers)) {
      newUsers = [newUsers];
    }
    return newUsers;
  } catch (err) {
    console.error("Error reading newuser file:", err);
    return [];
  }
}

// Utility function to save new users to newuser.json
function saveNewUsers(newUsers) {
  try {
    fs.writeFileSync(newUserFilePath, JSON.stringify(newUsers, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing to newuser file:", err);
  }
}

// Helper function to load all users (from data.json and newuser.json)
function loadAllUsers() {
  const usersFromData = loadUsers();
  const usersFromNew = loadNewUsers();
  return [...usersFromData, ...usersFromNew];
}

// Initialize our users array from data.json (used for existence check)
let users = loadUsers();

// LOGIN
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login request received:', req.body);

  // Combine users from both files
  const allUsers = loadAllUsers();

  // Find the matching user
  const user = allUsers.find(u => u.username === username && u.password === password);

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
  
  // Reload the primary users list from data.json for existence check
  users = loadUsers();
  const exists = users.find(u => u.username === username || u.email === email);
  if (exists) {
    return res.status(409).json({ success: false, message: 'User already exists' });
  }

  const newUser = {
    "username": username,
    "password": password,
    "email": email,
    hydrationData: [],                  
    todayHydration: 0,                  
    hasUnlockedTree: false,            
    "unlockableTrees": [
      "Misty Bonsai",
      "Sunflower",
      "Golden Sun"
    ],
    "plantLevel": 0,
    "longestStreak": 0,
    "currentStreak": 0,
    "totalWaterLogged": 0,
    "notificationsEnabled": "Turn On Notifications"
  };

  // Instead of pushing newUser to data.json, add it to newuser.json
  const newUsers = loadNewUsers();
  newUsers.push(newUser);
  saveNewUsers(newUsers);

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

