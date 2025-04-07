const express = require("express");
const router = express.Router();

// Load the user data from the mock-data folder
const usersData = require("../mock-data/data.json");
const userData = Array.isArray(usersData) ? usersData[0] : usersData;
// GET ACCOUNT DETAILS
router.get("/account", (req, res) => {
  console.log("Account details request received");
  res.json({
    success: true,
    data: {
      username: userData.username,
      email: userData.email,
      plantLevel: userData.plantLevel || 0, // Defaulting plantLevel if not provided
      longestStreak: userData.longestStreak || "0 days", // Defaulting if not provided
      currentStreak: userData.currentStreak || "0 days", // Defaulting if not provided
      totalWaterLogged: userData.totalWaterLogged || "0L", // Defaulting if not provided
      notificationsEnabled: userData.notificationsEnabled || false // Defaulting if not provided
    }
  });
});

// TOGGLE NOTIFICATIONS
router.post("/account/notifications", (req, res) => {
  const { notificationsEnabled } = req.body;
  console.log("Notification toggle request received:", req.body);

  if (notificationsEnabled === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing 'notificationsEnabled' field"
    });
  }

  userData.notificationsEnabled = notificationsEnabled;

  res.json({
    success: true,
    message: `Notifications ${notificationsEnabled ? "enabled" : "disabled"} successfully!`
  });
});

// UPDATE PROFILE (Email or Password)
router.post("/account/update", (req, res) => {
  const { email, password } = req.body;
  console.log("Profile update request received:", req.body);

  if (!email && !password) {
    return res.status(400).json({
      success: false,
      message: "Missing fields. Provide 'email' or 'password' to update."
    });
  }

  if (email) {
    userData.email = email; // Update email
    console.log(`Email updated to: ${email}`);
  }

  if (password) {
    userData.password = password; // Update password
    console.log("Password updated successfully!");
  }

  res.json({
    success: true,
    message: "Profile updated successfully!"
  });
});

module.exports = router;

