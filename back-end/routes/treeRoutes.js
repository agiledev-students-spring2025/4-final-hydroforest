const express = require('express');
const router = express.Router();
const Tree = require('../database/Tree');

// GET all trees
router.get('/', async (req, res) => {
  try {
    const trees = await Tree.find();
    res.json(trees);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching trees');
  }
});

module.exports = router;  // Ensure this line is correctly exporting the router
