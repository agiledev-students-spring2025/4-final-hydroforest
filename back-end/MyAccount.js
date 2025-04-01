// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // For environment variables

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Static routes serving files

// Mock JSON data for stats and preferences
const userStats = {
  plantLevel: 10,
  longestStreak: 20,
  currentStreak: 5,
  totalWaterLogged: 75
};

const userPreferences = {
  notificationsEnabled: true
};

// API endpoint for stats (dynamic route)
app.get('/api/stats', (req, res) => {
  res.json(userStats);
});

// API endpoint for preferences (dynamic route)
app.get('/api/preferences', (req, res) => {
  res.json(userPreferences);
});

// POST route for updating preferences
app.post('/api/update-preferences', (req, res) => {
  const { notificationsEnabled } = req.body;
  userPreferences.notificationsEnabled = notificationsEnabled;
  res.status(200).send({ success: true, updatedPreferences: userPreferences });
});

// Static route for profile picture
app.get('/profile-picture', (req, res) => {
  res.sendFile(__dirname + '/public/profile-picture.jpg'); // Adjust the path as necessary
});

// Instructions to start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
