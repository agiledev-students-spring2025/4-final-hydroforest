const express = require("express");
const router = express.Router();

const users = [
  {
    username: "LiTheLegend",
    email: "test@example.com",
    plantLevel: 10,
    longestStreak: "20 days",
    currentStreak: "5 days",
    totalWaterLogged: "75L",
    notificationsEnabled: true
  }
];

// GET ACCOUNT DETAILS
router.get("/account", (req, res) => {
  console.log("Account details request received"); 
  res.json({
    success: true,
    data: users[0] // For simplicity, return the first user
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

  users[0].notificationsEnabled = notificationsEnabled;
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
    users[0].email = email; // Update email in mock data
    console.log(`Email updated to: ${email}`);
  }

  if (password) {
    users[0].password = password; // Update password in mock data
    console.log("Password updated successfully!");
  }

  res.json({
    success: true,
    message: "Profile updated successfully!"
  });
});

module.exports = router;

