const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../database/User"); 

// CHANGE PASSWORD (Authenticated)
router.post("/change-password", [
  check("currentPassword").notEmpty().withMessage("Current password required"),
  check("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  check("reEnterNewPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) throw new Error("Passwords do not match");
    return true;
  })
], passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Fetch user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    // Hash new password before storing
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await User.findByIdAndUpdate(req.user.id, { $set: { password: hashedPassword } });

    res.json({ success: true, message: "Password changed successfully!" });

  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

