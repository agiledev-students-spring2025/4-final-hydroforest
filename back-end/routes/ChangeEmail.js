const express = require("express");
const router = express.Router();

const users = [
  { username: "LiTheLegend", email: "test@example.com", password: "1234" }
];

// CHANGE EMAIL
router.post("/change-email", (req, res) => {
  const { currentEmail, newEmail } = req.body;
  console.log("Change email request received:", req.body); 

  if (!currentEmail || !newEmail) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const user = users.find(u => u.email === currentEmail);
  if (!user) {
    return res.status(404).json({ success: false, message: "Current email not found" });
  }

  // Simulate updating the email
  user.email = newEmail;
  res.json({
    success: true,
    message: `Verification email has been sent to: ${newEmail}`
  });
});

module.exports = router;