import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Sling as Hamburger } from 'hamburger-react';
import "./ForestPage.css";

const GRID_SIZE = 5;

const ForestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hydrationData, setHydrationData] = useState([]);
  const [forestPlants, setForestPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [treeImages, setTreeImages] = useState([]);
  const [grid, setGrid] = useState(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  

  // Create an empty grid based on GRID_SIZE
  // const grid = Array(GRID_SIZE)
  //   .fill(null)
  //   .map(() => Array(GRID_SIZE).fill(null));


  // Fetch tree images from database
  useEffect(() => {
    fetch('/api/trees')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(tree => ({
          name: tree.name,
          src: tree.stages.adultTree
        }));
        setTreeImages(formatted);
        
        // console.log(formatted)
        
      })
      .catch(err => console.error("Error fetching tree images:", err));
  }, []);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    fetch("/api/forest", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/Login");
          return;
        }
        return res.json();
      })
      .then((data) => {
        const sortedData = data.hydrationData.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setHydrationData(sortedData);
  
        const unlockedPlantsWithDates = sortedData
          .filter(record => record.unlockedPlant)
          .map(record => ({ name: record.unlockedPlant, unlockedOn: record.date }));
  
        const unlockedPlantsWithImages = unlockedPlantsWithDates
          .map(({ name, unlockedOn }) => {
            const plantObj = treeImages.find(p => p.name.trim().toLowerCase() === name.trim().toLowerCase());
            return plantObj ? { name, src: plantObj.src, unlockedOn } : null;
          })
          .filter(Boolean);
  
        setForestPlants(unlockedPlantsWithImages);
      })
      .catch(err => console.error("Error fetching forest data:", err));
  }, [treeImages]);


  useEffect(() => {
  
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  
    forestPlants.forEach((plant, index) => {
      const x = index % GRID_SIZE;
      const y = Math.floor(index / GRID_SIZE);
  

  
      if (x < GRID_SIZE && y < GRID_SIZE) {
        newGrid[y][x] = plant;
      }
    });
  
    setGrid(newGrid);
  }, [forestPlants]);
  

  return (
    <div className="forest-page">
      <header>       {/* Hamburger Menu Button (Aligned Right) */}
        <h2> </h2>
       <div className="hamburger-menu">
            <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
          </div></header>
      <h1 className="forest-title">Welcome to Your Forest</h1>

      {/* Sidebar Menu */}
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
        <motion.div 
          className="help-popup"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="help-message">
            <h2>HydroForest</h2>
            <p>This app helps you stay hydrated while growing a virtual forest. Log your water to unlock new plants!</p>
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
        </motion.div>
      )}

      <p className="forest-caption">Each plant represents a hydration goal met! Keep hydrating to unlock more plants.</p>

      {/* Forest Grid */}
      <div className="forest-grid">
        {grid.map((row, rowIndex) =>
          row.map((plant, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-tile ${plant ? "occupied" : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (rowIndex + colIndex) * 0.1, duration: 0.5 }}
              onClick={() => plant && setSelectedPlant(plant)}
            >
              {plant && <img src={plant.src} alt={plant.name} className="grid-plant" />}
            </motion.div>
          ))
        )}
      </div>

      {/* Full-Screen Popup for Selected Plant */}
      {selectedPlant && (
        <motion.div
          className="fullscreen-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="popup-content">
            <img src={selectedPlant.src} alt={selectedPlant.name} className="popup-plant-image" />
            <h3>{selectedPlant.name}</h3>
            {selectedPlant.unlockedOn && (
              <p>
          Unlocked on: {new Date(selectedPlant.unlockedOn).toISOString().slice(0, 10)}
        </p>
            )}
            <button className="close-btn" onClick={() => setSelectedPlant(null)}>Close</button>
          </div>
        </motion.div>
      )}

      {/* Bottom Navigation Bar */}
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

export default ForestPage;

