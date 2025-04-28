import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import './MyAccount.css';
import { motion } from 'framer-motion';

const MyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [accountData, setAccountData] = useState({
    username: '',
    email: '',
    plantLevel: 0,
    longestStreak: '0',
    currentStreak: '0',
    totalWaterLogged: '0',
    notificationsEnabled: false,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
      return;
    }

    fetch("http://localhost:5005/api/MyAccount/account", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          setAccountData(response.data);
          setNotificationsEnabled(response.data.notificationsEnabled);
        } else {
          console.error("Failed to load account data");
        }
      })
      .catch(err => console.error("Error fetching account data:", err));
  }, [navigate]);

  const handleToggleNotifications = () => {
    const newSetting = !notificationsEnabled;
    setNotificationsEnabled(newSetting);

    const token = localStorage.getItem("token");

    fetch("http://localhost:5005/api/MyAccount/account/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ notificationsEnabled: newSetting })
    })
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(err => console.error("Error updating notifications:", err));
  };

  return (
    
    <div className="entire-account-page">
      <header>
      <h2> </h2>
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
      <div className="account-container">
        <h1 className="title">My Account</h1>
        <div className="profile-section">
          <img
            src="https://picsum.photos/100"
            alt="Profile"
            className="profile-picture"
          />
          <h2 className="accountUsername" style={{ color: '#333' }}>
            {accountData.username}
          </h2>
        </div>

        <div className="stats">
          <p>Current Plant Level: <span>{accountData.plantLevel}</span></p>
          <p>Longest Streak: <span>{accountData.longestStreak} days</span></p>
          <p>Current Streak: <span>{accountData.currentStreak} days</span></p>
          <p>Total Water Logged: <span>{(accountData.totalWaterLogged / 1000).toFixed(2)}L</span></p>
        </div>

        <div className="account-info">
          <label>Email:</label>
          <div className="editable-field">
            <input type="text" value={accountData.email} readOnly />
            <button onClick={() => navigate('/change-email')}>Edit</button>
          </div>

          <label>Password:</label>
          <div className="editable-field">
            <input type="password" value="********" readOnly />
            <button onClick={() => navigate('/change-password')}>Edit</button>
          </div>
        </div>

        <div className="preferences">
          <label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
            />
            {notificationsEnabled ? 'Turn Off Notifications' : 'Turn On Notifications'}
          </label>
        </div>

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
    </div>
  );
};

export default MyAccount;
