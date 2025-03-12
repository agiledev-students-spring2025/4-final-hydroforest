import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import "./ForestPage.css"; 

const GRID_SIZE = 5;

const plantImages = [
  { id: 1, src: "/images/plants1.png", name: "Sunleaf", unlockedOn: "Day 1" },
  { id: 2, src: "/images/plants2.png", name: "Aqua Fern", unlockedOn: "Day 2" },
  { id: 3, src: "/images/plants3.png", name: "Hydro Cactus", unlockedOn: "Day 3" },
  { id: 4, src: "/images/plants4.png", name: "Blooming Berry", unlockedOn: "Day 4" },
  { id: 5, src: "/images/plants5.png", name: "Misty Bonsai", unlockedOn: "Day 5" },
  { id: 6, src: "/images/plants6.png", name: "Crystal Orchid", unlockedOn: "Day 6" },
  { id: 7, src: "/images/plants7.png", name: "Verdant Vine", unlockedOn: "Day 7" },
  { id: 8, src: "/images/plants8.png", name: "Ethereal Sprout", unlockedOn: "Day 8" },
  { id: 9, src: "/images/plants9.png", name: "Golden Growth", unlockedOn: "Day 9" }
];

const ForestPage = ({ completedDays }) => {
  //adding this for navigation
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL path


  const [selectedPlant, setSelectedPlant] = useState(null);

  const unlockedPlants = plantImages.slice(0, completedDays);

  const grid = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));

  unlockedPlants.forEach((plant, index) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);
    if (x < GRID_SIZE && y < GRID_SIZE) {
      grid[y][x] = plant;
    }
  });

  return (
    <div className="forest-page">
      <h1 className="forest-title">Welcome to Your Forest</h1>
      <p className="forest-caption">Each plant represents a hydration goal met! Keep going to unlock more.</p>

      {/* Isometric Grid Forest */}
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

      {/* Full-Screen Pop-up */}
      {selectedPlant && (
         <motion.div
         className="fullscreen-popup"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.5 }}
         onClick={() => setSelectedPlant(null)}
       >
         <div className="popup-content">
           <img src={selectedPlant.src} alt={selectedPlant.name} className="popup-plant-image" />
           <h3>{selectedPlant.name}</h3>
           <p>Unlocked on {selectedPlant.unlockedOn}</p>
           <button className="close-btn" onClick={() => setSelectedPlant(null)}>Close</button>
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

export default ForestPage;
