const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data.json");

// Helper functions
const readData = () => JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
const writeData = (data) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");

const getTodayDate = () => new Date().toISOString().split("T")[0];

const initializeDailyHydration = () => {
  const data = readData();
  const today = getTodayDate();

  if (!data.hydrationData.length || data.hydrationData[data.hydrationData.length - 1].date !== today) {
    data.hydrationData.push({ date: today, amount: 0, unlockedPlant: "None" });
    writeData(data);
  }
};

// GET Homepage Data
router.get("/", (req, res) => {
  initializeDailyHydration();
  const data = readData();
  res.json({ success: true, data });
});

// POST Log Water Intake
router.post("/log-water", (req, res) => {
  const { amount, unit } = req.body;
  let amountInOz = unit === "ml" ? amount / 29.5735 : amount;

  const data = readData();
  data.growingTree.progress += amountInOz / 2;

  if (data.growingTree.progress >= 4) {
    data.fullyGrownTrees.push({ name: data.growingTree.name, date: getTodayDate() });
    data.unlockedTrees.push(data.growingTree.name);
    data.unlockableTrees = ["Sequoia", "Bamboo", "Willow"];
    data.growingTree = { name: data.selectedTree, progress: 0 };
  }

  data.hydrationData[data.hydrationData.length - 1].amount += amount;
  writeData(data);

  res.json({ success: true, message: "Water logged", growingTree: data.growingTree, fullyGrownTrees: data.fullyGrownTrees });
});

// POST Select Tree
router.post("/select-tree", (req, res) => {
  const { tree } = req.body;
  const data = readData();

  if (data.unlockableTrees.includes(tree)) {
    data.selectedTree = tree;
    data.growingTree = { name: tree, progress: 0 };
    writeData(data);
    res.json({ success: true, message: "Tree selected", selectedTree: tree, growingTree: data.growingTree });
  } else {
    res.status(400).json({ success: false, message: "Tree not available for unlocking" });
  }
});

module.exports = router;
