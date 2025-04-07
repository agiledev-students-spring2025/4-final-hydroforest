import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sling as Hamburger } from 'hamburger-react';
import './Leaderboard.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showHelp, setShowHelp] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/leaderboard');
        const { leaderboard } = await response.json();
        setFriends(leaderboard);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <h1 className="page-title">Leaderboard</h1>

      <header>
        <div className="hamburger-menu">
          <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
        </div>

        <motion.div
          className="sidebar-menu"
          initial={{ x: '100%' }}
          animate={{ x: isOpen ? 0 : '100%' }}
          transition={{ type: 'tween', duration: 0.4 }}
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
            <p>This app is designed to help you stay hydrated while growing a virtual forest.</p>
            <h3>Daily 8 Cups Goal</h3>
            <p>Your daily goal is to drink <strong>8 cups (2 liters)</strong> of water.</p>
            <h3>Unlocking Plants</h3>
            <p>When you reach your goal, you unlock new plants in your forest.</p>
            <h3>Forest Collection</h3>
            <p>The more consistent you are, the more beautiful your forest becomes!</p>
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
        </motion.div>
      )}

      {/* Podium */}
      {friends.length >= 3 && (
        <div className="leaderboard-podium">
          <motion.div className="podium-item podium-second">
            <img className="profile-image" src={friends[1].src} alt={friends[1].name} />
            <p className="podium-name">{friends[1].name}</p>
            <p className="podium-rank">2nd place</p>
            <p className="podium-score">{friends[1].hydration} L</p>
          </motion.div>

          <motion.div className="podium-item podium-first">
            <img className="profile-image" src={friends[0].src} alt={friends[0].name} />
            <p className="podium-name">{friends[0].name}</p>
            <p className="podium-rank">1st place</p>
            <p className="podium-score">{friends[0].hydration} L</p>
          </motion.div>

          <motion.div className="podium-item podium-third">
            <img className="profile-image" src={friends[2].src} alt={friends[2].name} />
            <p className="podium-name">{friends[2].name}</p>
            <p className="podium-rank">3rd place</p>
            <p className="podium-score">{friends[2].hydration} L</p>
          </motion.div>
        </div>
      )}

      {/* Leaderboard Table */}
      <motion.div className="leaderboard-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Profile</th>
              <th>Plant Level</th>
            </tr>
          </thead>
          <tbody>
            {friends.length > 3 && friends.slice(3).map((friend, index) => (
              <tr key={friend.id}>
                <td>{index + 4}</td>
                <td><img className="profile-image" src={friend.src} alt={friend.name} /></td>
                <td>{friend.hydration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Bottom Nav */}
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

export default Leaderboard;
