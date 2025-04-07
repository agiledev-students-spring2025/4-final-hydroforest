import React, { useState, useEffect } from "react";
import Hamburger from 'hamburger-react';
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import "./Homepage.css";

const HomePage = () => {
  const [totalIntake, setTotalIntake] = useState(0); // stored in ml
  const [unit, setUnit] = useState("cups");
  const [treeStage, setTreeStage] = useState("seed");
  const [inputAmount, setInputAmount] = useState(0);
  const [isWatering, setIsWatering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState("");
  const [treeData, setTreeData] = useState({}); // fetched from backend
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
        setSelectedTree(data.selectedTree);
        setTotalIntake(data.totalIntake); // remains in ml
        setTreeStage(data.currentStage);
        setHasUnlockedTree(data.hasUnlockedTree);
      })
      .catch(err => console.error("Error fetching home data:", err));
  }, []);

  // Unlock tree popup logic: trigger popup if totalIntake reaches/exceeds 1920 ml and not yet unlocked.
  useEffect(() => {
    console.log("💧 totalIntake (ml):", totalIntake);
    console.log("🌲 hasUnlockedTree:", hasUnlockedTree);
    if (totalIntake >= 1920 && !hasUnlockedTree) {
      setTimeout(() => {
        setShowUnlockPopup(true);
      }, 1800);
      
      setTimeout(() => {
        setHasUnlockedTree(true);
      }, 2500);
    }
  }, [totalIntake, hasUnlockedTree]);

  // Modified handleLogWater function: converts input to ml before sending.
  const handleLogWater = () => {
    const amount = Number(inputAmount);
    if (amount > 0) {
      setIsWatering(true);
      setShowWaterPouring(true);
      setTimeout(() => {
        setShowWaterPouring(false);
      }, 1000);

      // Convert user input to ml based on selected unit.
      let amountInMl = amount;
      if (unit === "cups") amountInMl = amount * 240;
      else if (unit === "oz") amountInMl = amount * 30;

      fetch("http://localhost:5005/api/Home/log-water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInMl })
      })
        .then(res => res.json())
        .then(data => {
          setTotalIntake(data.totalIntake); // stays in ml
          setTreeStage(data.currentStage);
          // Use the justUnlocked flag from backend to trigger popup.
          if (data.justUnlocked) {
            setTimeout(() => {
              setShowUnlockPopup(true);
            }, 1800);
          }
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

  // Handler for selecting a tree (rejects change if already unlocked).
  const handleSelectTree = (treeKey) => {
    fetch("http://localhost:5005/api/Home/select-tree", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedTree: treeKey })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.error); });
        }
        return res.json();
      })
      .then(data => {
        setSelectedTree(data.selectedTree);
        setIsModalOpen(false);
      })
      .catch(err => {
        console.error("Error selecting tree:", err);
        alert(err.message);
      });
  };

  // Function to calculate water needed for the next stage.
  // Thresholds are in ml: 480 ml (2 cups), 960 ml (4 cups), 1440 ml (6 cups), 1920 ml (8 cups).
  const getWaterNeededForNextStage = () => {
    const thresholds = {
      seed: 480,
      sprout: 960,
      seedling: 1440,
      sapling: 1920
    };

    const mlNeeded = thresholds[treeStage] ? Math.max(thresholds[treeStage] - totalIntake, 0) : 0;
    let amount = mlNeeded;
    if (unit === "cups") amount = mlNeeded / 240;
    else if (unit === "oz") amount = mlNeeded / 30;

    const nextStage = {
      seed: "Sprout",
      sprout: "Seedling",
      seedling: "Sapling",
      sapling: "Adult Tree"
    }[treeStage] || "";

    return {
      amount: amount % 1 === 0 ? amount : amount.toFixed(1),
      nextStage
    };
  };

  const { amount: waterLeft, nextStage } = getWaterNeededForNextStage();

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
          unit === "cups" ? Math.round(totalIntake / 240) :
          unit === "oz" ? Math.round(totalIntake / 30) :
          Math.round(totalIntake)
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

      <button id="changetreebtn" className="btn" onClick={() => setIsModalOpen(true)}>
        Change Tree
      </button>

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
        <button className="btn" onClick={handleLogWater}>
          Log Water Intake
        </button>
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
            <button className="btn" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
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
            <img
              src={treeData[selectedTree] ? treeData[selectedTree]["adult tree"] : ""}
              alt="Unlocked Tree"
              className="popup-plant-image"
            />
            <p>
              You unlocked the <strong>{selectedTree}</strong> by staying hydrated!
            </p>
            <button className="close-btn" onClick={() => setShowUnlockPopup(false)}>
              Close
            </button>
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