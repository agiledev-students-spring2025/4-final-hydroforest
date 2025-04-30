import React, { useState, useEffect } from "react";
import Hamburger from 'hamburger-react';
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import "./Homepage.css";
import HydrationTipsModal from "./components/HydrationTipsModal";
import HydrationTipRotate from "./components/HydrationTipRotate";

const HomePage = () => {
  const [totalIntake, setTotalIntake] = useState(0);
  const [unit, setUnit] = useState("cups");
  const [treeStage, setTreeStage] = useState("seed");
  const [inputAmount, setInputAmount] = useState(0);
  const [isWatering, setIsWatering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [showWaterPouring, setShowWaterPouring] = useState(false);
  const [showUnlockPopup, setShowUnlockPopup] = useState(false);
  const [hasUnlockedTree, setHasUnlockedTree] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [treeImage, setTreeImage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);

  //  Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
    }
  }, [navigate]);

  // Fetch home data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/Home/data", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/Login");
        }
        return res.json();
      })
      .then(data => {
        setTreeData(data.trees || []);
        setSelectedTree(data.selectedTree);
        setTotalIntake(data.totalIntake);
        setTreeStage(data.currentStage);
        setHasUnlockedTree(data.hasUnlockedTree);
        setTreeImage(data.treeImage);
      })
      .catch(err => console.error("Error fetching home data:", err));
  }, [navigate]);

  //  Show unlock popup
  useEffect(() => {
    if (totalIntake >= 1920 && !hasUnlockedTree) {
      setTimeout(() => setShowUnlockPopup(true), 1800);
      setTimeout(() => setHasUnlockedTree(true), 2500);
    }
  }, [totalIntake, hasUnlockedTree]);

  const handleLogWater = () => {
    const token = localStorage.getItem("token");
    const amount = Number(inputAmount);
    if (amount > 0) {
      setIsWatering(true);
      setShowWaterPouring(true);
      setTimeout(() => setShowWaterPouring(false), 1000);
  
      let amountInMl = amount;
      if (unit === "cups") amountInMl = amount * 240;
      else if (unit === "oz") amountInMl = amount * 30;
  
      fetch("/api/Home/log-water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: amountInMl })
      })
        .then(res => res.json())
        .then(data => {
          if (data.justUnlocked) {
            setTimeout(() => setShowUnlockPopup(true), 1800);
          }
          return fetch("/api/Home/data", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        })
        .then(res => res.json())
        .then(data => {
          setTotalIntake(data.totalIntake);
          setTimeout(() => setTreeStage(data.currentStage), 1200);
          setTimeout(() => setTreeImage(data.treeImage), 1200);
          setHasUnlockedTree(data.hasUnlockedTree);
          if (data.justUnlocked) {
            console.log(" Tree just unlocked!");
            setTimeout(() => setShowUnlockPopup(true), 1800);
          }
        })
        .catch(err => console.error("Error updating water:", err))
        .finally(() => setTimeout(() => setIsWatering(false), 1300));
    }
  };
  

  const handleSelectTree = (treeKey) => {
    const token = localStorage.getItem("token");
  
    fetch("/api/home/select-tree", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ selectedTree: treeKey })
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.error); });
        return res.json();
      })
      .then(() => {
        return fetch("/api/Home/data", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      })
      .then(res => res.json())
      .then(data => {
        setSelectedTree(data.selectedTree);
        setTreeImage(data.treeImage); //  image now updates
        setTreeStage(data.currentStage);
        setIsModalOpen(false);
      })
      .catch(err => {
        console.error("Error selecting tree:", err);
        alert(err.message);
      });
  };
  

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
          <li className="logout" onClick={() => { localStorage.clear(); navigate("/Login"); setOpen(false); }}>Logout</li>
        </ul>
      </motion.div>

      {showHelp && (
        <motion.div className="help-popup" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="help-message">
            <h2>HydroForest</h2>
            <p>This app helps you stay hydrated while growing a virtual forest. Each water log helps a plant grow!</p>
            <h3>Daily 8 Cups Goal</h3>
            <p>Your goal is to drink <strong>8 cups (2 liters)</strong> of water. Log each cup to help your tree evolve.</p>
            <h3>Unlocking Plants</h3>
            <p>Once you hit 8 cups, you unlock a new tree in your forest.</p>
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

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${Math.min((totalIntake / 1920) * 100, 100)}%` }}
        ></div>
      </div>
      <p className="progress-text">
        {Math.min(((totalIntake / 1920) * 100).toFixed(0), 100)}% of daily goal
      </p>
      {/* <HydrationTipsModal /> */}
      <HydrationTipRotate/>
      <p className="howFarFromGoal">
        {treeStage !== "adultTree"
          ? `Only ${waterLeft} more ${unit} to reach the ${nextStage}`
          : "Congrats! Your tree is fully grown"}
      </p>

      {showWaterPouring && <img src="/images/water-bottle2.png" alt="Water Pouring" className="water-bottle" />}
      {showWaterPouring && <div className="water"></div>}

      <motion.div animate={{ scale: isWatering ? [1, 1.08, 1] : 1 }} transition={{ duration: 1.1, delay: 0.7 }} className="tree-wrapper">
        <div className="tree-container">
          <motion.img
            key={treeStage}
            src={treeImage}
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
              {treeData.map(tree => (
                <img
                  key={tree.name}
                  src={tree.stages.adultTree}
                  alt={tree.name}
                  className="tree-option"
                  onClick={() => {
                    handleSelectTree(tree.name);
                    setIsModalOpen(false);
                  }}
                />
              ))}
            </div>
            <button className="btn" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {showUnlockPopup && (
        <motion.div className="fullscreen-popup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="popup-content">
            <img
              src={
                treeData.find(tree => tree.name === selectedTree)
                  ? treeData.find(tree => tree.name === selectedTree).stages.adultTree
                  : ""
              }
              alt="Unlocked Tree"
              className="popup-plant-image"
            />
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
