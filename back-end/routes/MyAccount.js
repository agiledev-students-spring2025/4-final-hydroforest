const express = require("express");
const router = express.Router();
const User = require("../database/User"); 
const { check, validationResult } = require("express-validator");
const passport = require("passport");

// GET ACCOUNT DETAILS (Authenticated route)
router.get("/account", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    // Fetch user & populate friends list (Ensures only actual friends are retrieved)
    const user = await User.findById(req.user.id).populate({
      path: "friends",
      select: "username plantLevel" // Limits the data returned for friends
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        plantLevel: user.plantLevel || 1,
        longestStreak: user.longestStreak || 0,
        currentStreak: user.currentStreak || 0,
        totalWaterLogged: user.totalWaterLogged || 0,
        notificationsEnabled: user.notificationsEnabled || false,
        hydrationData: user.hydrationData || [], // Returns user's hydration history
        friends: user.friends.map(friend => ({
          username: friend.username,
          plantLevel: friend.plantLevel
        })) // Correctly formats actual friends data
      }
    });
  } catch (error) {
    console.error("Error fetching account details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// TOGGLE NOTIFICATIONS
router.post("/account/notifications", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { notificationsEnabled } = req.body;

    if (notificationsEnabled === undefined) {
      return res.status(400).json({ success: false, message: "Missing 'notificationsEnabled' field" });
    }

    await User.findByIdAndUpdate(req.user.id, { $set: { notificationsEnabled } });

    res.json({ success: true, message: `Notifications ${notificationsEnabled ? "enabled" : "disabled"} successfully!` });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;


