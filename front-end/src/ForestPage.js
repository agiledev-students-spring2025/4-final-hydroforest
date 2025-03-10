import React, { useState } from "react";
import { motion } from "framer-motion";
import "./ForestPage.css"; 

// 🌱 Plant Data (Each plant unlocks after meeting daily goals)
const plantImages = [
  { id: 1, src: "/images/plants1.png", name: "Sunleaf", unlockedOn: "Day 1", description: "This plant flourishes in the morning sunlight, representing the start of your hydration journey!" },
  { id: 2, src: "/images/plants2.png", name: "Aqua Fern", unlockedOn: "Day 2", description: "A rare fern that absorbs moisture from the air, symbolizing consistent hydration." },
  { id: 3, src: "/images/plants3.png", name: "Hydro Cactus", unlockedOn: "Day 3", description: "A resilient cactus that thrives even in dry conditions, just like your growing hydration habits!" },
  { id: 4, src: "/images/plants4.png", name: "Blooming Berry", unlockedOn: "Day 4", description: "A vibrant plant that bears fruit, showing that your hydration is starting to pay off!" },
  { id: 5, src: "/images/plants5.png", name: "Misty Bonsai", unlockedOn: "Day 5", description: "A delicate bonsai that thrives on small, consistent watering." },
  { id: 6, src: "/images/plants6.png", name: "Crystal Orchid", unlockedOn: "Day 6", description: "A mystical orchid that only blooms when hydration is at its peak!" },
  { id: 7, src: "/images/plants7.png", name: "Verdant Vine", unlockedOn: "Day 7", description: "A climbing vine that grows stronger each day, just like your hydration streak!" },
  { id: 8, src: "/images/plants8.png", name: "Ethereal Sprout", unlockedOn: "Day 8", description: "A glowing sprout that appears only in the presence of healthy hydration." },
  { id: 9, src: "/images/plants9.png", name: "Golden Growth", unlockedOn: "Day 9", description: "A legendary plant that radiates energy, signifying your hydration mastery!" }
];

const ForestPage = ({ completedDays }) => {
  const [selectedPlant, setSelectedPlant] = useState(null);

  // 🌿 Filter to show only unlocked plants
  const unlockedPlants = plantImages.slice(0, completedDays);

  // 🌲 Group plants into shelves (3 plants per row)
  const shelves = [];
  for (let i = 0; i < unlockedPlants.length; i += 3) {
    shelves.push(unlockedPlants.slice(i, i + 3));
  }

  return (
    <div className="forest-page">
      <h1 className="forest-title">Your Hydration Forest</h1>
      <p>Each plant represents a hydration goal met! Keep going to unlock more.</p>

      {/* 🪵 Shelves with Plants */}
      <div className="shelves">
        {shelves.map((shelf, shelfIndex) => (
          <div key={shelfIndex} className="shelf">
            {shelf.map((plant) => (
              <motion.div
                key={plant.id}
                className="plant-container"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: plant.id * 0.2, duration: 0.8 }}
                onClick={() => setSelectedPlant(plant)}
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)" }}
              >
                <img src={plant.src} alt={plant.name} className="plant-image" />
                <p className="plant-name">{plant.name}</p>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* 🌱 Full-Screen Pop-up */}
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
            <p className="popup-description">{selectedPlant.description}</p>
            <button className="close-btn" onClick={() => setSelectedPlant(null)}>Close</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ForestPage;
