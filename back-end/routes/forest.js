const express = require("express");
const router = express.Router();
const userData = require('../mock-data/data.json');


router.get("/", (req, res) => {
  res.json({hydrationData: userData.hydrationData});
});

module.exports = router;
