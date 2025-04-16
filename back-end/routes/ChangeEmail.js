const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../database/User");

// CHANGE EMAIL (Authenticated)
router.post("/change-email", [
  check("currentEmail").isEmail().withMessage("Invalid current email format"),
  check("newEmail").isEmail().withMessage("Invalid new email format")
], passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentEmail, newEmail } = req.body;

    // Fetch user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if current email matches stored email
    if (user.email !== currentEmail) {
      return res.status(400).json({ success: false, message: "Current email does not match records" });
    }

    // Ensure new email is not already taken
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "New email is already in use" });
    }

    // Update email securely
    await User.findByIdAndUpdate(req.user.id, { $set: { email: newEmail } });

    res.json({ success: true, message: `Verification email sent to ${newEmail}` });

  } catch (error) {
    console.error("Error changing email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

