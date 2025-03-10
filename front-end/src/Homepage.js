import React, { useState } from "react";
import Hamburger from 'hamburger-react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
    seed: "https://picsum.photos/200?random=11",
    sprout: "https://picsum.photos/200?random=12",
    seedling: "https://picsum.photos/200?random=13",
    sapling: "https://picsum.photos/200?random=14",
    "adult tree": "https://picsum.photos/200?random=15",
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
  const [currentPage, setCurrentPage] = useState("home");
  const navigate = useNavigate();

  const handleLogWater = () => {
    const amount = Number(inputAmount);
    if (amount > 0) {
      setIsWatering(true);
      setShowWaterPouring(true); // Show the water bottle
  
      setTimeout(() => {
        setShowWaterPouring(false); // Hide the water bottle
      }, 1000);

      setTimeout(() => {
        setIsWatering(false);
      }, 1300);
  
      const newTotalIntake = totalIntake + amount;
      setTotalIntake(newTotalIntake);
  
    // Determine next tree stage but delay setting it
    let nextTreeStage = treeStage;

    if (newTotalIntake >= 2 && newTotalIntake < 4) nextTreeStage = "sprout";
    else if (newTotalIntake >= 4 && newTotalIntake < 6) nextTreeStage = "seedling";
    else if (newTotalIntake >= 6 && newTotalIntake < 8) nextTreeStage = "sapling";
    else if (newTotalIntake >= 8) nextTreeStage = "adult tree";

    // Delay changing the tree stage to avoid instant image swap
    setTimeout(() => {
      setTreeStage(nextTreeStage);
    },1200); // Adjust timing to match animation smoothness
  }
  };

  return (
    <div className="container">
      
      <header>
        <h2 className="username">Hi, Jaleen!</h2>
        <div className="hamburger-menu">
        <Hamburger color="white" /></div>
      </header>

      <p className="topCaption">Today you drank {totalIntake} {unit}</p>
      <h3>{treeStage}</h3>
      {showWaterPouring && <img src="/images/water-bottle.png" alt="Water Pouring" className="water-bottle" />}
      {showWaterPouring && <div className="water"></div> }      
      <motion.div 
        animate={{ scale: isWatering ? [1, 1.08, 1] : 1 }} 
        transition={{ duration: 1.1, delay: 0.7 }} 
        className="tree-wrapper"
        >
        <div className="tree-container">
            <motion.img
            key={treeStage} // This forces re-render on stage change
            src={trees[selectedTree][treeStage]} 
            alt="Tree Icon" 
            className="tree-image"
            initial={{ opacity: 0 }} // Start faded out and slightly lower
            animate={{ opacity: 1,}} // Smoothly fade in and move up
            transition={{ duration: 1.5 }} // Smooth fade-in transition
            />
    </div>
    </motion.div>


      <button id="changetreebtn" className="btn" onClick={() => setIsModalOpen(true)}>Change Tree</button>

      <div className="card">
        <div className="input-group">
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

      {/* Bottom Navigation Bar */}
      <div className="navbar">
      <div className="nav-item active" onClick={() => navigate("/")}>
        <span>Home</span>
      </div>
      <div className="nav-item" onClick={() => navigate("/Forest")}>
        <span>Forest</span>
      </div>
      <div className="nav-item" onClick={() => navigate("/Calendar")}>
        <span>Calendar</span>
      </div>
      <div className="nav-item" onClick={() => navigate("/social")}>
        <span>Social</span>
      </div>
    </div>


    </div>
  );
};

export default HomePage;
