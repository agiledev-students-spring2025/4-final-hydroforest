const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../database/User');
const Tree = require('../database/Tree');

const router = express.Router();


// Utility: Get today’s date in YYYY-MM-DD (Eastern Time)
function getTodayDate() {
  const date = new Date();
  const est = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(date);
  return `${est.find(p => p.type === "year").value}-${est.find(p => p.type === "month").value}-${est.find(p => p.type === "day").value}`;
}

// Tree stage based on ml intake
function getTreeStage(totalMl) {
  if (totalMl < 480) return "seed";
  else if (totalMl < 960) return "sprout";
  else if (totalMl < 1440) return "seedling";
  else if (totalMl < 1920) return "sapling";
  else return "adultTree";
}

// GET /api/home/data — Protected
router.get(
  '/data',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const today = getTodayDate();
      const todayRecord = user.hydrationData.find(r => r.date.toISOString().startsWith(today));
      if (user.selectedTreeDate !== today) {
        user.selectedTree = null;
        user.selectedTreeDate = today;
        await user.save();
      }
      const totalIntake = todayRecord?.amount || 0;
      const selectedTreeName = user.selectedTree || todayRecord?.unlockedPlant || user.unlockableTrees[0];
      const treeDoc = await Tree.findOne({ name: selectedTreeName });
      const currentStage = getTreeStage(totalIntake);
      const unlockableTreeDocs = await Tree.find({ name: { $in: user.unlockableTrees } });
      res.json({
        user: {
          username: user.username,
          hydrationData: user.hydrationData,
          totalWaterLogged: user.totalWaterLogged,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          hasUnlockedTree: !!todayRecord?.unlockedPlant,
          unlockableTrees: user.unlockableTrees
        },
        trees: unlockableTreeDocs, 
        selectedTree: selectedTreeName,
        totalIntake,
        currentStage,
        hasUnlockedTree: !!todayRecord?.unlockedPlant,
        treeImage: treeDoc?.stages[currentStage] || null
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

//  POST /api/home/log-water — Protected
router.post(
  '/log-water',
  passport.authenticate('jwt', { session: false }),
  [
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be positive')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const amount = parseFloat(req.body.amount);
      const today = getTodayDate();
      let todayRecord = user.hydrationData.find(r => r.date.toISOString().startsWith(today));

      if (todayRecord) {
        todayRecord.amount += amount;
      } else {
        user.hydrationData.push({ date: new Date(today), amount });
        // Streak logic
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const hadYesterday = user.hydrationData.some(r =>
          r.date.toISOString().startsWith(yesterday.toISOString().slice(0, 10))
        );
        user.currentStreak = hadYesterday ? user.currentStreak + 1 : 1;
        user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
      }

      user.totalWaterLogged += amount;

      const updatedRecord = user.hydrationData.find(r => r.date.toISOString().startsWith(today));
      const totalIntake = updatedRecord.amount;
      const currentStage = getTreeStage(totalIntake);
      const selectedTreeName = user.selectedTree || user.unlockableTrees[0];
      let justUnlocked = false;

      if (totalIntake >= 1920 && !updatedRecord.unlockedPlant) {
        updatedRecord.unlockedPlant = selectedTreeName;
        user.hasUnlockedTree = true;
        justUnlocked = true;
      }

      await user.save();
      const treeDoc = await Tree.findOne({ name: selectedTreeName });

      res.json({
        totalIntake,
        currentStage,
        justUnlocked,
        hasUnlockedTree: !!updatedRecord.unlockedPlant,
        hydrationData: user.hydrationData,
        selectedTree: selectedTreeName,
        treeImage: treeDoc?.stages[currentStage] || null
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// POST /api/home/select-tree — Protected
router.post(
  '/select-tree',
  passport.authenticate('jwt', { session: false }),
  [
    body('selectedTree').notEmpty().withMessage('Tree name is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { selectedTree } = req.body;
      if (!user.unlockableTrees.includes(selectedTree)) {
        return res.status(400).json({ error: 'Invalid tree selection' });
      }

      const today = getTodayDate();
      const todayRecord = user.hydrationData.find(r => r.date.toISOString().startsWith(today));

      if (todayRecord?.amount >= 1920 && todayRecord.unlockedPlant) {
        return res.status(400).json({ error: 'Tree already unlocked for today' });
      }

      user.selectedTree = selectedTree;
      await user.save();

      res.json({
        selectedTree,
        hydrationData: user.hydrationData,
        message: 'Tree selection updated'
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = { router };






