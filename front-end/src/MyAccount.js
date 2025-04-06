import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import './MyAccount.css';

const MyAccount = () => {
  const navigate = useNavigate();

  // State for managing the notifications toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className="entire-account-page">
    <div className="account-container">
      {/* Page Title */}
      <h1 className="title">My Account</h1>

      {/* Profile Section */}
      <div className="profile-section">
        <img
          src="https://picsum.photos/100" /* Placeholder profile picture */
          alt="Profile"
          className="profile-picture"
        />
        <h2 className="username" style={{ color: '#333' }}>
          {/* Added inline style as a fallback to ensure visibility */}
          LiTheLegend
        </h2>
      </div>

      {/* Stats Section */}
      <div className="stats">
        <p>Current Plant Level: <span>10</span></p>
        <p>Longest Streak: <span>20 days</span></p>
        <p>Current Streak: <span>5 days</span></p>
        <p>Total Water Logged: <span>75L</span></p>
      </div>

      {/* Editable Fields Section */}
      <div className="account-info">
        
      <label>Email:</label>
        <div className="editable-field">
          <input type="text" value="test@example.com" readOnly />
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
    </div>
  );
};

export default MyAccount;
