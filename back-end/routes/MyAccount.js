const express = require("express");
const router = express.Router();
const User = require("../database/User"); 
const passport = require("passport");

router.get("/account", passport.authenticate("jwt", { session: false }), async (req, res) => {
  // return user data
});

router.post("/account/notifications", passport.authenticate("jwt", { session: false }), async (req, res) => {
  // update notification toggle
});

module.exports = router;
