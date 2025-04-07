import React, { useState, useEffect } from "react";
import Hamburger from 'hamburger-react';
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import "./Homepage.css";

const HomePage = () => {
  const [totalIntake, setTotalIntake] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [unit, setUnit] = useState("cups");
  const [treeStage, setTreeStage] = useState("seed");
  const [inputAmount, setInputAmount] = useState(0);
  const [isWatering, setIsWatering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState("");
  const [treeData, setTreeData] = useState({}); // Fetched tree data from backend
  const [showWaterPouring, setShowWaterPouring] = useState(false);
  const [showUnlockPopup, setShowUnlockPopup] = useState(false);
  const [hasUnlockedTree, setHasUnlockedTree] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);

  // Fetch initial data from backend when component mounts
  useEffect(() => {
    fetch("http://localhost:5005/api/Home/data")
      .then(res => res.json())
      .then(data => {
        setTreeData(data.trees);
        const treeKeys = Object.keys(data.trees);
        setSelectedTree(data.selectedTree);
        setTotalIntake(data.totalIntake);
        setTreeStage(data.currentStage);
        setHasUnlockedTree(data.hasUnlockedTree);
      })
      .catch(err => console.error("Error fetching home data:", err));
  }, []);

  // Unlock tree popup logic (unchanged)
  useEffect(() => {
    if (totalIntake >= 1920 && !hasUnlockedTree) {
      setHasUnlockedTree(true);
      setTimeout(() => {
        setShowUnlockPopup(true);
      }, 2000);
    }
  }, [totalIntake, hasUnlockedTree]);
  

  // Modified handleLogWater function to use POST request
  const handleLogWater = () => {
    const amount = Number(inputAmount);
    if (amount > 0) {
      setIsWatering(true);
      setShowWaterPouring(true);
  
      setTimeout(() => {
        setShowWaterPouring(false);
      }, 1000);
  
      //  Convert input to milliliters before sending to backend
      let amountInMl = amount;
      if (unit === "cups") amountInMl = amount * 240;
      else if (unit === "oz") amountInMl = amount * 30;
  
      fetch("http://localhost:5005/api/Home/log-water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInMl }) //  Always in ml
      })
        .then(res => res.json())
        .then(data => {
          //  Convert back to display in selected unit
          let displayAmount = data.totalIntake;
          if (unit === "cups") displayAmount = (data.totalIntake / 240).toFixed(1);
          else if (unit === "oz") displayAmount = (data.totalIntake / 30).toFixed(1);
          setDisplayAmount(displayAmount);
          setTotalIntake(data.totalIntake);
          setTimeout(() => {
            setTreeStage(data.currentStage);
          }, 1300);
          setHasUnlockedTree(data.hasUnlockedTree);
        })
        .catch(err => console.error("Error logging water:", err))
        .finally(() => {
          setTimeout(() => {
            setIsWatering(false);
          }, 1300);
        });
    }
  };
  
   // Handler for selecting a tree.
  // This route will reject the change if the tree is already unlocked.
  const handleSelectTree = (treeKey) => {
    fetch("http://localhost:5005/api/Home/select-tree", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ selectedTree: treeKey })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.error); });
        }
        return res.json();
      })
      .then(data => {
        // Update selectedTree only if successfully updated
        setSelectedTree(data.selectedTree);
        setIsModalOpen(false);
      })
      .catch(err => {
        console.error("Error selecting tree:", err);
        alert(err.message);
      });
  };
  

  // Function to calculate water needed for the next stage
  const getWaterNeededForNextStage = () => {
    const totalInCups = totalIntake / 240;
  
    let neededCups = 0;
    let nextStage = "";
  
    if (treeStage === "seed") {
      neededCups = Math.max(2 - totalInCups, 0);
      nextStage = "Sprout";
    } else if (treeStage === "sprout") {
      neededCups = Math.max(4 - totalInCups, 0);
      nextStage = "Seedling";
    } else if (treeStage === "seedling") {
      neededCups = Math.max(6 - totalInCups, 0);
      nextStage = "Sapling";
    } else if (treeStage === "sapling") {
      neededCups = Math.max(8 - totalInCups, 0);
      nextStage = "Adult Tree";
    }
  
    let amountInSelectedUnit = neededCups * 240; // default in ml
    if (unit === "cups") amountInSelectedUnit = neededCups;
    else if (unit === "oz") amountInSelectedUnit = neededCups * 8;
  
    return {
      amount: Math.max(amountInSelectedUnit, 0).toFixed(1),
      nextStage
    };
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
              This app helps you stay hydrated while growing a virtual forest. Each water log helps a plant grow!
            </p>
            <h3>Daily 8 Cups Goal</h3>
            <p>
              Your goal is to drink <strong>8 cups (2 liters)</strong> of water. Log each cup to help your tree evolve.
            </p>
            <h3>Unlocking Plants</h3>
            <p>
              Once you hit 8 cups, you unlock a new tree in your forest.
            </p>
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
        </motion.div>
      )}

      <p className="topCaption">
        Today you drank {
        unit === "cups"
        ? Math.round(totalIntake / 240)
        : unit === "oz"
        ? Math.round(totalIntake / 30)
        : Math.round(totalIntake)
        } {unit}
      </p>
      <p className="howFarFromGoal">
        {treeStage !== "adult tree"
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
            src={treeData[selectedTree] ? treeData[selectedTree][treeStage] : ""}
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
          <input
            className="waterAmount"
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="Enter amount"
          />
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
              {treeData && Object.keys(treeData).map((treeKey) => (
                <img
                  key={treeKey}
                  src={treeData[treeKey]["adult tree"]}
                  alt={treeKey}
                  className="tree-option"
                  onClick={() => { handleSelectTree(treeKey); setIsModalOpen(false); }}

                />
              ))}
            </div>
            <button className="btn" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {showUnlockPopup && (
        <motion.div
          className="fullscreen-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="popup-content">
            <img src={treeData[selectedTree] ? treeData[selectedTree]["adult tree"] : ""} alt="Unlocked Tree" className="popup-plant-image" />
            <p>You unlocked the <strong>{selectedTree}</strong> by staying hydrated!</p>
            <button className="close-btn" onClick={() => setShowUnlockPopup(false)}>Close</button>
          </div>
        </motion.div>
      )}

      <div className="navbar">
        <div className={`nav-item ${location.pathname === "/" ? "active" : ""}`} onClick={() => navigate("/")}>
          <img className="icon-image" src="images/icon/home1.png" alt="Home" />
        </div>
        <div className={`nav-item ${location.pathname === "/Forest" ? "active" : ""}`} onClick={() => navigate("/Forest")}>
          <img className="icon-image" src="images/icon/forest.png" alt="Forest" />
        </div>
        <div className={`nav-item ${location.pathname === "/Calendar" ? "active" : ""}`} onClick={() => navigate("/Calendar")}>
          <img className="icon-image" src="images/icon/calendar.png" alt="Calendar" />
        </div>
        <div className={`nav-item ${location.pathname === "/Social" ? "active" : ""}`} onClick={() => navigate("/Social")}>
          <img className="icon-image" src="images/icon/friend.png" alt="Social" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
