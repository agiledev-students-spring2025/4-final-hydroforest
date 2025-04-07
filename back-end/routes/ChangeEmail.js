const express = require('express');
const router = express.Router();

// Load the user data from the mock-data folder
const userData = require('../mock-data/data.json');

// CHANGE EMAIL
router.post('/change-email', (req, res) => {
  const { currentEmail, newEmail } = req.body;
  console.log("Change email request received:", req.body);

  if (!currentEmail || !newEmail) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // Validate the current email
  if (userData.email !== currentEmail) {
    return res.status(404).json({ success: false, message: "Current email not found" });
  }

  // Simulate updating the email
  userData.email = newEmail;

  res.json({
    success: true,
    message: `Verification email has been sent to: ${newEmail}`
  });
});

module.exports = router;
