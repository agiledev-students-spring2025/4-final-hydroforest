const express = require('express');
const router = express.Router();

// This variable will hold the current water intake (mock data for now)
let waterIntake = 0;
let hasUnlockedTree = false;

// Define the tree images data (same as what you had on the front-end)
const trees = {
  "Misty Bonsai": {
    seed: "/images/tree1/seed.png",
    sprout: "/images/tree1/sprout.png",
    seedling: "/images/tree1/seedling.png",
    sapling: "/images/tree1/sapling.png",
    "adult tree": "/images/tree1/adult_tree.png"
  },
  "tree2": {
    seed: "/images/tree2/seed.png",
    sprout: "/images/tree2/sprout.png",
    seedling: "/images/tree2/seedling.png",
    sapling: "/images/tree2/sapling.png",
    "adult tree": "/images/tree2/adult_tree.png"
  },
  "tree3": {
    seed: "/images/tree3/seed.png",
    sprout: "/images/tree3/sprout.png",
    seedling: "/images/tree3/seedling.png",
    sapling: "/images/tree3/sapling.png",
    "adult tree": "/images/tree3/adult_tree.png"
  }
};

// Helper function to determine tree stage based on water intake
function getTreeStage(total) {
  if (total < 2) return "seed";
  else if (total < 4) return "sprout";
  else if (total < 6) return "seedling";
  else if (total < 8) return "sapling";
  else return "adult tree";
}
// Set the flag if water intake is at least 8 and not already unlocked
if (waterIntake >= 8 && !hasUnlockedTree) {
  hasUnlockedTree = true;
}

// GET route to send the tree images and current water intake data
router.get('/data', (req, res) => {
  const selectedTree = "Misty Bonsai"; // Default or currently selected tree
  res.json({
    trees,
    selectedTree,
    totalIntake: waterIntake,
    currentStage: getTreeStage(waterIntake),
    hasUnlockedTree
  });
});

// POST route to log water intake (mock updating of water intake)
router.post('/log-water', (req, res) => {
  const { amount } = req.body;
  const waterAmount = parseFloat(amount);
  
  if (isNaN(waterAmount) || waterAmount <= 0) {
    return res.status(400).json({ error: "Invalid water amount provided" });
  }
  
  waterIntake += waterAmount;

  // Set the flag if water intake is at least 8 and not already unlocked
  if (waterIntake >= 8 && !hasUnlockedTree) {
    hasUnlockedTree = true;
  }
  res.json({
    totalIntake: waterIntake,
    currentStage: getTreeStage(waterIntake),
    hasUnlockedTree
  });
});

module.exports = router;

