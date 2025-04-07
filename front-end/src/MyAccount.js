import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import './MyAccount.css';

const MyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for storing account details from the backend
  const [accountData, setAccountData] = useState({
    username: '',
    email: '',
    plantLevel: 0,
    longestStreak: '0 days',
    currentStreak: '0 days',
    totalWaterLogged: '0L',
    notificationsEnabled: false
  });

  // Local state for notifications toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Hamburger menu state (if you use it)
  const [isOpen, setOpen] = useState(false);

  // Fetch account details from the backend on mount
  useEffect(() => {
    fetch("http://localhost:5005/api/MyAccount/account")
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
  }, []);

  // Handler for toggling notifications:
  // This sends a POST request to update the JSON data and updates local state.
  const handleToggleNotifications = () => {
    const newSetting = !notificationsEnabled;
    setNotificationsEnabled(newSetting);

    fetch("http://localhost:5005/api/MyAccount/account/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationsEnabled: newSetting })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
        // Optionally update the accountData state if needed:
        setAccountData(prev => ({ ...prev, notificationsEnabled: newSetting }));
      })
      .catch(err => console.error("Error updating notifications:", err));
  };

  return (
    <div className="entire-account-page">
      <div className="account-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/Account')}>
          Back
        </button>

        {/* Heading */}
        <h1 className="form-heading">My Account</h1>

        {/* Profile Section */}
        <div className="profile-section">
          <img
            src="https://picsum.photos/100" // Placeholder profile picture
            alt="Profile"
            className="profile-picture"
          />
          <h2 className="username" style={{ color: '#333' }}>
            {accountData.username}
          </h2>
        </div>

        {/* Stats Section */}
        <div className="stats">
          <p>
            Current Plant Level: <span>{accountData.plantLevel}</span>
          </p>
          <p>
            Longest Streak: <span>{accountData.longestStreak}</span>
          </p>
          <p>
            Current Streak: <span>{accountData.currentStreak}</span>
          </p>
          <p>
            Total Water Logged: <span>{accountData.totalWaterLogged}</span>
          </p>
        </div>

        {/* Editable Fields Section */}
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

        {/* Notification Preferences Section */}
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
    </div>
  );
};

export default MyAccount;


