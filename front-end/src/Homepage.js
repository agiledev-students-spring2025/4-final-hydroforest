import React, { useState, useEffect } from "react";
import Hamburger from 'hamburger-react';
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import "./Homepage.css";

const trees = {
  "Misty Bonsai": {
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
  const [selectedTree, setSelectedTree] = useState("Misty Bonsai");
  const [showWaterPouring, setShowWaterPouring] = useState(false);
  const [showUnlockPopup, setShowUnlockPopup] = useState(false); //  state for pop-up
  const [hasUnlockedTree, setHasUnlockedTree] = useState(false); // Track if popup was shown
  const [showHelp, setShowHelp] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (totalIntake >= 8 && !hasUnlockedTree) {
      setHasUnlockedTree(true); // Prevent re-triggering
      setTimeout(() => {
        setShowUnlockPopup(true); // Delay popup
      }, 2000);
    }
  }, [totalIntake]);

  const getWaterNeededForNextStage = () => {
    if (treeStage === "seed") return { amount: Math.max(2 - totalIntake, 0), nextStage: "Sprout" };
    if (treeStage === "sprout") return { amount: Math.max(4 - totalIntake, 0), nextStage: "Seedling" };
    if (treeStage === "seedling") return { amount: Math.max(6 - totalIntake, 0), nextStage: "Sapling" };
    if (treeStage === "sapling") return { amount: Math.max(8 - totalIntake, 0), nextStage: "Adult Tree" };
    return { amount: 0, nextStage: "" };
  };

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
    <div className="home-container">
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
          <li onClick={() => { setShowHelp(true); setOpen(false); }}>Help</li>
          <li className="logout" onClick={() => { navigate("/Login"); setOpen(false); }}>Logout</li>
        </ul>
      </motion.div>
      
          {/* this is for help pop up */}
          {showHelp && (
        <motion.div 
          className="help-popup"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="help-message">
            <h2>HydroForest</h2>
            <p>
              This app is designed to help you stay hydrated while growing a virtual forest. Here's how it works:
            </p>
    
            <h3>Daily 8 Cups Goal</h3>
            <p>
              Your daily goal is to drink <strong>8 cups (2 liters)</strong> of water. Each time you log a cup of water, you help a plant in your virtual forest grow!
            </p>
    
            <h3>Unlocking Plants</h3>
            <p>
              When you reach your daily goal of 8 cups, you unlock a new plant in your forest. These plants are unique and can be found in your forest collection. Keep hydrating to grow a lush and vibrant forest!
            </p>
    
            <h3> Forest Collection</h3>
            <p>
              Visit your forest to see all the plants you've unlocked. Each plant represents a day you successfully met your hydration goal. The more consistent you are, the more diverse and beautiful your forest will become!
            </p>
    
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
            </motion.div>
          )}

      <p className="topCaption">Today you drank {totalIntake} {unit}</p>
      
      <p className="howFarFromGoal">{treeStage !== "adult tree"
    ? `Only ${getWaterNeededForNextStage().amount} more ${unit} to reach the ${getWaterNeededForNextStage().nextStage}`
    : "Congrats! Your tree is fully grown"}
      </p>

      {showWaterPouring && <img src="/images/water-bottle2.png" alt="Water Pouring" className="water-bottle" />}
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
          // onClick={() => setShowUnlockPopup(false)}
        >
          <div className="popup-content">
            <img src={trees[selectedTree]["adult tree"]} alt="Unlocked Tree" className="popup-plant-image" />
            <h3></h3>
            <p>You unlocked the <strong>{selectedTree}</strong> by staying hydrated! </p>
            <button className="close-btn" onClick={() => setShowUnlockPopup(false)}>Close</button>
          </div>
        </motion.div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="navbar">
        <div className={`nav-item ${location.pathname === "/" ? "active" : ""}`} onClick={() => navigate("/")}>
          <img
              className="icon-image" 
              src="images/icon/home1.png"
              alt="Home" /> 
        </div>
        <div className={`nav-item ${location.pathname === "/Forest" ? "active" : ""}`} onClick={() => navigate("/Forest")}>
          <img
              className="icon-image" 
              src="images/icon/forest.png"
              alt="Forest" /> 
        </div>
        <div className={`nav-item ${location.pathname === "/Calendar" ? "active" : ""}`} onClick={() => navigate("/Calendar")}>
          <img
              className="icon-image" 
              src="images/icon/calendar.png"
              alt="Calendar" /> 
        </div>
        <div className={`nav-item ${location.pathname === "/Social" ? "active" : ""}`} onClick={() => navigate("/Social")}>
          <img
              className="icon-image" 
              src="images/icon/friend.png"
              alt="Social" /> 
        </div>
      </div>
    </div>
  );
};

export default HomePage;
