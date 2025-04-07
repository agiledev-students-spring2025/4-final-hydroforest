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

// Helper to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const date = new Date();

  // Convert to Eastern Timezone string
  const easternDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const year = easternDate.find(p => p.type === "year").value;
  const month = easternDate.find(p => p.type === "month").value;
  const day = easternDate.find(p => p.type === "day").value;

  return `${year}-${month}-${day}`; //  "2025-04-06"
}

// Get today's hydration record from hydrationData array
function getTodayRecord() {
  const today = getTodayDate();
  return userData.hydrationData.find(record => record.date === today);
}

// Compute total hydration for today by reading today's record (or 0 if none)
function getTodayTotal() {
  const record = getTodayRecord();
  return record ? record.amount : 0;
}

// Update today's hydration record by adding waterAmount.
// If no record exists, create one with unlockedPlant initialized as null.
function updateHydrationRecord(waterAmount) {
  const today = getTodayDate();
  console.log(today);
  let record = userData.hydrationData.find(rec => rec.date === today);
  if (record) {
    record.amount += waterAmount;
  } else {
    record = { date: today, amount: waterAmount, unlockedPlant: null };
    userData.hydrationData.push(record);
  }
  return record;
}

// GET route: Respond with combined user and tree data.
// Also, if total water for today is >= 8 and no unlockedPlant is set, update it.
router.get('/data', (req, res) => {
  let todayRecord = getTodayRecord();
  const totalIntake = getTodayTotal();

  // Use the user's selected tree if available; otherwise default to the first unlockable tree.
  let selectedTree = userData.selectedTree || userData.unlockableTrees[0];
  if (todayRecord && todayRecord.unlockedPlant) {
    selectedTree = todayRecord.unlockedPlant;
  }

  // If total intake is 8 or more and today's record hasn't been marked with an unlocked plant, update it.
  if (totalIntake >= 8) {
    if (!todayRecord) {
      todayRecord = { date: getTodayDate(), amount: 0, unlockedPlant: selectedTree };
      userData.hydrationData.push(todayRecord);
    } else if (!todayRecord.unlockedPlant) {
      todayRecord.unlockedPlant = selectedTree;
    }
    // Also update the user's selectedTree so it persists on refresh.
    userData.selectedTree = selectedTree;

    // Ensure the unlocked tree is in the unlockedTrees list.
    if (!userData.unlockedTrees.includes(selectedTree)) {
      userData.unlockedTrees.push(selectedTree);
    }
  }

  res.json({
    user: {
      username: userData.username,
      hydrationData: userData.hydrationData,
      hasUnlockedTree: todayRecord && todayRecord.unlockedPlant ? true : false,
      unlockedTrees: userData.unlockedTrees,
      unlockableTrees: userData.unlockableTrees
    },
    trees, // Tree data loaded from trees.json
    selectedTree,
    totalIntake: totalIntake,
    currentStage: getTreeStage(totalIntake),
    hasUnlockedTree: todayRecord && todayRecord.unlockedPlant ? true : false
  });
});

// POST route: Log water intake and update hydration data accordingly.
router.post('/log-water', (req, res) => {
  const { amount } = req.body;
  const waterAmount = parseFloat(amount);
  
  if (isNaN(waterAmount) || waterAmount <= 0) {
    return res.status(400).json({ error: "Invalid water amount provided" });
  }
  
  // Update today's hydration record.
  const todayRecord = updateHydrationRecord(waterAmount);
  const totalIntake = getTodayTotal();
  
  // Determine current selected tree (from userData or default).
  const currentSelectedTree = userData.selectedTree || userData.unlockableTrees[0];
  
  // If total intake reaches/exceeds 8 cups and unlockedPlant is not set, update it.
  if (totalIntake >= 8 && !todayRecord.unlockedPlant) {
    todayRecord.unlockedPlant = currentSelectedTree;
    // Also update the user's selectedTree so it persists.
    userData.selectedTree = currentSelectedTree;
    if (!userData.unlockedTrees.includes(currentSelectedTree)) {
      userData.unlockedTrees.push(currentSelectedTree);
    }
  }
  
  res.json({
    totalIntake: totalIntake,
    currentStage: getTreeStage(totalIntake),
    hasUnlockedTree: todayRecord.unlockedPlant ? true : false,
    unlockedTrees: userData.unlockedTrees,
    unlockableTrees: userData.unlockableTrees,
    hydrationData: userData.hydrationData,
    selectedTree: userData.selectedTree
  });
});

// POST route to update the selected tree based on user input.
// If water intake is already 8 or more (tree unlocked), this route will refuse to update.
router.post('/select-tree', (req, res) => {
  const { selectedTree } = req.body;
  
  // Validate: Ensure selectedTree is among the unlockable trees.
  if (!selectedTree || !userData.unlockableTrees.includes(selectedTree)) {
    return res.status(400).json({ error: "Invalid tree selection" });
  }
  
  // Check if today's hydration qualifies and the tree is already unlocked.
  const todayRecord = getTodayRecord();
  if (todayRecord && todayRecord.amount >= 8 && todayRecord.unlockedPlant) {
    return res.status(400).json({ error: "Tree already unlocked. Cannot change selection." });
  }
  
  // Otherwise, update the user's selected tree.
  userData.selectedTree = selectedTree;
  
  res.json({
    selectedTree,
    hydrationData: userData.hydrationData,
    message: "Tree selection updated."
  });
});

module.exports = router;





