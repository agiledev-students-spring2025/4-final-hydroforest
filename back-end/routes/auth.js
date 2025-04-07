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

// Utility function to load new users from newUser.json
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
    console.error("Error reading newUser file:", err);
    return [];
  }
}

// Utility function to save new users to newUser.json
function saveNewUsers(newUsers) {
  try {
    fs.writeFileSync(newUserFilePath, JSON.stringify(newUsers, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing to newUser file:", err);
  }
}

// Helper function to load all users (from data.json and newUser.json)
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
  console.log("All users:", allUsers);
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

  // Create the new user object
  const newUser = {
    username: username.trim(),
    password: password.trim(),
    email: email.trim(),
    hydrationData: [],
    hasUnlockedTree: false,
    unlockableTrees: ["Misty Bonsai", "Sunflower", "Golden Sun"],
    plantLevel: 0,
    longestStreak: 0,
    currentStreak: 0,
    totalWaterLogged: 0,
    notificationsEnabled: "Turn On Notifications"
  };

  // Directly overwrite newUser.json
  try {
    fs.writeFileSync(newUserFilePath, JSON.stringify(newUser, null, 2), 'utf8');
    console.log("New user successfully written to file.");
  } catch (err) {
    console.error("Error writing to newUser file:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }

  console.log("New users after signup:", loadNewUsers());
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


