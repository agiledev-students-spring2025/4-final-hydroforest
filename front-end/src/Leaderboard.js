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
  const [users, setUsers] = useState([]);

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
        const userId = '67ff39e04d4948ffd9ffdc37'; // Replace with dynamic ID if needed
        const response = await fetch(`/api/leaderboard/${userId}`);
        const { leaderboard } = await response.json();
        setUsers(leaderboard || []);
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

      {/* Podium (top 3) */}
      {users.length > 0 && (
        <div className="leaderboard-podium">
          {users[1] && (
            <motion.div className="podium-item podium-second">
              <img className="profile-image" src={users[1].src || 'https://picsum.photos/101'} alt={users[1].username} />
              <p className="podium-name">{users[1].username}</p>
              <p className="podium-rank">2nd place</p>
              <p className="podium-score">{users[1].totalWaterLogged} mL</p>
            </motion.div>
          )}
          {users[0] && (
            <motion.div className="podium-item podium-first">
              <img className="profile-image" src={users[0].src || 'https://picsum.photos/100'} alt={users[0].username} />
              <p className="podium-name">{users[0].username}</p>
              <p className="podium-rank">1st place</p>
              <p className="podium-score">{users[0].totalWaterLogged} mL</p>
            </motion.div>
          )}
          {users[2] && (
            <motion.div className="podium-item podium-third">
              <img className="profile-image" src={users[2].src || 'https://picsum.photos/102'} alt={users[2].username} />
              <p className="podium-name">{users[2].username}</p>
              <p className="podium-rank">3rd place</p>
              <p className="podium-score">{users[2].totalWaterLogged} mL</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Leaderboard Table */}
      <motion.div className="leaderboard-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Profile</th>
              <th>Water Logged</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 3 && users.slice(3).map((user, index) => (
              <tr key={user._id}>
                <td>{index + 4}</td>
                <td>
                  <img className="profile-image" src={user.src || 'https://picsum.photos/100'} alt={user.username} />
                  <span>{user.username}</span>
                </td>
                <td>{user.totalWaterLogged} mL</td>
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
