const express = require("express");
const router = express.Router();

const users = [
  { username: "LiTheLegend", email: "test@example.com", password: "1234" }
];

// CHANGE PASSWORD
router.post("/change-password", (req, res) => {
  const { currentPassword, newPassword, reEnterNewPassword } = req.body;
  console.log("Password change request received:", req.body); // ✅ Log request data

  if (!currentPassword || !newPassword || !reEnterNewPassword) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  if (newPassword !== reEnterNewPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and re-entered password do not match"
    });
  }

  const user = users.find(u => u.password === currentPassword);
  if (!user) {
    return res.status(401).json({ success: false, message: "Current password is incorrect" });
  }

  // Simulate password update
  user.password = newPassword;

  res.json({
    success: true,
    message: "Password changed successfully!"
  });
});

module.exports = router;


