import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sling as Hamburger } from 'hamburger-react';
import './Leaderboard.css';

const Leaderboard = ({ friends }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);

  // Sort friends in descending order of hydration
  const sortedFriends = [...friends].sort((a, b) => b.hydration - a.hydration);

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
            <li onClick={() => { navigate("/Help"); setOpen(false); }}>Help</li>
            <li className="logout" onClick={() => { navigate("/Login"); setOpen(false); }}>Logout</li>
          </ul>
        </motion.div>
      </header>

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

      <button className="social-back-button" onClick={() => navigate('/social')}>
        Back to Social
      </button>

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
