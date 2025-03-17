import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sling as Hamburger } from 'hamburger-react';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="leaderboard-page">
      <h1 className="page-title">Leaderboard</h1>
      <header>
        <h1></h1>
        <div className="hamburger-menu">
          <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
        </div>
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
      </header>

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


      {/* Leaderboard Table */}
      <motion.div 
        className="leaderboard-container"

      >
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Friend</th>
              <th>Hydration (L)</th>
            </tr>
          </thead>
          <tbody>
            {sortedFriends.map((friend, index) => (
              <tr key={friend.id}>
                <td>{index + 1}</td>
                <td>{friend.name}</td>
                <td>{friend.hydration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

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

export default Leaderboard;