import React, { useState, useEffect } from "react";
import Hamburger from 'hamburger-react';
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import "./Homepage.css";

const trees = {
  tree1: {
    seed: "/images/tree1/seed.png",
    sprout: "/images/tree1/sprout.png",
    seedling: "/images/tree1/seedling.png",
    sapling: "/images/tree1/sapling.png",
    "adult tree": "/images/tree1/adult_tree.png",
  },
  tree2: {
    seed: "/images/tree2/seed.png",
    sprout: "/images/tree2/sprout.png",
    seedling: "/images/tree2/seedling.png",
    sapling: "/images/tree2/sapling.png",
    "adult tree": "/images/tree2/adult_tree.png",
  },
  tree3: {
    seed: "/images/tree3/seed.png",
    sprout: "/images/tree3/sprout.png",
    seedling: "/images/tree3/seedling.png",
    sapling: "/images/tree3/sapling.png",
    "adult tree": "/images/tree3/adult_tree.png",
  },
};

const HomePage = () => {
  const [totalIntake, setTotalIntake] = useState(0);
  const [unit, setUnit] = useState("cups");
  const [treeStage, setTreeStage] = useState("seed");
  const [inputAmount, setInputAmount] = useState(0);
  const [isWatering, setIsWatering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState("tree1");
  const [showWaterPouring, setShowWaterPouring] = useState(false);
  const [showUnlockPopup, setShowUnlockPopup] = useState(false); //  state for pop-up
  const [hasUnlockedTree, setHasUnlockedTree] = useState(false); // Track if popup was shown

  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (totalIntake >= 8 && !hasUnlockedTree) {
      setHasUnlockedTree(true); // Prevent re-triggering
      setTimeout(() => {
        setShowUnlockPopup(true); // Delay popup
      }, 2500);
    }
  }, [totalIntake]);

  const handleLogWater = () => {
    const amount = Number(inputAmount);
    if (amount > 0) {
      setIsWatering(true);
      setShowWaterPouring(true);

      setTimeout(() => {
        setShowWaterPouring(false);
      }, 1000);

      setTimeout(() => {
        setIsWatering(false);
      }, 1300);

      const newTotalIntake = totalIntake + amount;
      setTotalIntake(newTotalIntake);

      let nextTreeStage = treeStage;

      if (newTotalIntake >= 2 && newTotalIntake < 4) nextTreeStage = "sprout";
      else if (newTotalIntake >= 4 && newTotalIntake < 6) nextTreeStage = "seedling";
      else if (newTotalIntake >= 6 && newTotalIntake < 8) nextTreeStage = "sapling";
      else if (newTotalIntake >= 8) nextTreeStage = "adult tree";

      setTimeout(() => {
        setTreeStage(nextTreeStage);
      }, 1200);
    }
  };

  return (
    <div className="container">
      <header>
        <h2 className="username"></h2>
        <div className="hamburger-menu">
          <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
        </div>
      </header>

      <motion.div
        className="sidebar-menu"
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.4 }}
      >
        <ul>
          <li onClick={() => { navigate("/Account"); setOpen(false); }}>My Account</li>
          <li onClick={() => { navigate("/AboutUs"); setOpen(false); }}>About Us</li>
          <li onClick={() => { navigate("/Help"); setOpen(false); }}>Help</li>
          <li onClick={() => { navigate("/Login"); setOpen(false); }}>Logout</li>
        </ul>
      </motion.div>

      <p className="topCaption">Today you drank {totalIntake} {unit}</p>
      <p>{treeStage}</p>
      {showWaterPouring && <img src="/images/water-bottle.png" alt="Water Pouring" className="water-bottle" />}
      {showWaterPouring && <div className="water"></div>}

      <motion.div
        animate={{ scale: isWatering ? [1, 1.08, 1] : 1 }}
        transition={{ duration: 1.1, delay: 0.7 }}
        className="tree-wrapper"
      >
        <div className="tree-container">
          <motion.img
            key={treeStage}
            src={trees[selectedTree][treeStage]}
            alt="Tree Icon"
            className="tree-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
        </div>
      </motion.div>

      <button id="changetreebtn" className="btn" onClick={() => setIsModalOpen(true)}>Change Tree</button>

      <div className="card">
        <div className="input-group-water">
          <input className="waterAmount" type="number" value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} placeholder="Enter amount" />
          <select className="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="cups">Cups</option>
            <option value="oz">OZ</option>
            <option value="ml">ML</option>
          </select>
        </div>
        <button className="btn" onClick={handleLogWater}>Log Water Intake</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select a Tree</h3>
            <div className="tree-selection">
              {Object.keys(trees).map((treeKey) => (
                <img key={treeKey} src={trees[treeKey]["adult tree"]} alt={treeKey} className="tree-option" onClick={() => { setSelectedTree(treeKey); setIsModalOpen(false); }} />
              ))}
            </div>
            <button className="btn" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Full-Screen Pop-up for Unlocking the Tree */}
      {showUnlockPopup && (
        <motion.div
          className="fullscreen-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setShowUnlockPopup(false)}
        >
          <div className="popup-content">
            <img src={trees[selectedTree]["adult tree"]} alt="Unlocked Tree" className="popup-plant-image" />

            <button className="close-btn" onClick={() => setShowUnlockPopup(false)}>Close</button>
          </div>
        </motion.div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="navbar">
        <div className={`nav-item ${location.pathname === "/" ? "active" : ""}`} onClick={() => navigate("/")}>
          <span>Home</span>
        </div>
        <div className={`nav-item ${location.pathname === "/Forest" ? "active" : ""}`} onClick={() => navigate("/Forest")}>
          <span>Forest</span>
        </div>
        <div className={`nav-item ${location.pathname === "/Calendar" ? "active" : ""}`} onClick={() => navigate("/Calendar")}>
          <span>Calendar</span>
        </div>
        <div className={`nav-item ${location.pathname === "/Social" ? "active" : ""}`} onClick={() => navigate("/Social")}>
          <span>Social</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
