const express = require('express');
const router = express.Router();

// Load the user and tree data from the mock-data folder
const userData = require('../mock-data/data.json');
const trees = require('../mock-data/trees.json');

// Helper function to determine tree stage based on water intake
function getTreeStage(total) {
  if (total < 2) return "seed";
  else if (total < 4) return "sprout";
  else if (total < 6) return "seedling";
  else if (total < 8) return "sapling";
  else return "adult tree";
}

// Utility function to update today's hydration record
function updateHydrationRecord(waterAmount) {
  const today = new Date().toISOString().slice(0, 10);
  let todayRecord = userData.hydrationData.find(rec => rec.date === today);
  if (todayRecord) {
    todayRecord.amount += waterAmount;
  } else {
    todayRecord = { date: today, amount: waterAmount };
    userData.hydrationData.push(todayRecord);
  }
  return todayRecord;
}

// GET route: Respond with the combined user and tree data.
// Also checks and applies the unlock condition if necessary.
router.get('/data', (req, res) => {
  // Check the unlock condition on GET as well
  if (userData.todayHydration >= 8 && !userData.hasUnlockedTree) {
    userData.hasUnlockedTree = true;
    // For simplicity, default the unlocked tree to the first unlockable tree
    const defaultTree = userData.unlockableTrees[0];
    const todayRecord = updateHydrationRecord(0); // Ensure today's record exists
    todayRecord.unlockedPlant = defaultTree;
    if (!userData.unlockedTrees.includes(defaultTree)) {
      userData.unlockedTrees.push(defaultTree);
    }
  }

  // Automatically select the first unlockable tree as default
  const selectedTree = userData.unlockableTrees[0];

  res.json({
    user: {
      username: userData.username,
      todayHydration: userData.todayHydration,
      hasUnlockedTree: userData.hasUnlockedTree,
      unlockedTrees: userData.unlockedTrees,
      unlockableTrees: userData.unlockableTrees,
      hydrationData: userData.hydrationData
    },
    trees, // Tree data loaded from trees.json
    selectedTree,
    totalIntake: userData.todayHydration,
    currentStage: getTreeStage(userData.todayHydration),
    hasUnlockedTree: userData.hasUnlockedTree
  });
});

// POST route: Log water intake and update hydration data accordingly
router.post('/log-water', (req, res) => {
  const { amount } = req.body;
  const waterAmount = parseFloat(amount);
  
  if (isNaN(waterAmount) || waterAmount <= 0) {
    return res.status(400).json({ error: "Invalid water amount provided" });
  }
  
  // Update today's hydration total and record
  userData.todayHydration += waterAmount;
  const todayRecord = updateHydrationRecord(waterAmount);
  
  // If today's hydration reaches/exceeds 8 and the tree hasn't been unlocked yet,
  // update the flag and add the unlocked tree to the hydration record.
  if (userData.todayHydration >= 8 && !userData.hasUnlockedTree) {
    userData.hasUnlockedTree = true;
    const defaultTree = userData.unlockableTrees[0];
    todayRecord.unlockedPlant = defaultTree;
    if (!userData.unlockedTrees.includes(defaultTree)) {
      userData.unlockedTrees.push(defaultTree);
    }
  }
  
  res.json({
    totalIntake: userData.todayHydration,
    currentStage: getTreeStage(userData.todayHydration),
    hasUnlockedTree: userData.hasUnlockedTree,
    unlockedTrees: userData.unlockedTrees,
    unlockableTrees: userData.unlockableTrees,
    hydrationData: userData.hydrationData
  });
});

module.exports = router;


