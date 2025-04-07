const express = require('express');
const router = express.Router();

// Load the user data from the mock-data folder
const userData = require('../mock-data/data.json');

// CHANGE PASSWORD
router.post('/change-password', (req, res) => {
  const { currentPassword, newPassword, reEnterNewPassword } = req.body;
  console.log("Password change request received:", req.body);

  if (!currentPassword || !newPassword || !reEnterNewPassword) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  if (newPassword !== reEnterNewPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and re-entered password do not match"
    });
  }

  // Check if current password matches
  if (userData.password !== currentPassword) {
    return res.status(401).json({ success: false, message: "Current password is incorrect" });
  }

  // Update the password
  userData.password = newPassword;

  res.json({
    success: true,
    message: "Password changed successfully!"
  });
});

module.exports = router;
