const express = require('express');
const router = express.Router();
const Tree = require('../database/Tree');

// GET all trees
router.get('/', async (req, res) => {
  const trees = await Tree.find();
  res.json(trees);
});

// Add route to add a new tree (if needed)
module.exports = router;
