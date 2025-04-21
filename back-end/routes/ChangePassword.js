const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../database/User");

// CHANGE PASSWORD (Authenticated)
router.post("/change-password", [
  check("currentPassword").notEmpty().withMessage("Current password required"),
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  check("reEnterNewPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) throw new Error("Passwords do not match");
    return true;
  })
], passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    // Log authenticated user
    console.log("Authenticated User:", req.user);

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("Validation Errors:", errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Fetch user from database
    const user = await User.findById(req.user.id);
    if (!user) {
      console.warn("User not found for ID:", req.user.id);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      console.warn("Incorrect current password attempt for user:", user._id);
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    // Ensure new password is different from the old one
    if (await bcrypt.compare(newPassword, user.password)) {
      console.warn("New password matches old password for user:", user._id);
      return res.status(400).json({ success: false, message: "New password must be different from the current password" });
    }

    // Hash new password securely
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("Password updated successfully for user:", user._id);
    res.json({ success: true, message: "Password changed successfully!" });

  } catch (error) {
    console.error("Error changing password:", error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

