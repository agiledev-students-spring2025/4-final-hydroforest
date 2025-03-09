import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyAccount.css';

const MyAccount = () => {
  const navigate = useNavigate();

  // State for managing the notifications toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className="account-container">
      <h1 className="title">My Account</h1>

      {/* Profile Section */}
      <div className="profile-section">
        <img
          src="https://picsum.photos/100"
          alt="Profile"
          className="profile-picture"
        />
        <h2 className="username">LiTheLegend</h2>
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
        <label>Password:</label>
        <div className="editable-field">
          <input type="password" value="********" readOnly />
          <button onClick={() => navigate('/change-password')}>Edit</button>
        </div>

        <label>Email:</label>
        <div className="editable-field">
          <input type="text" value="junli123@email.com" readOnly />
          <button onClick={() => navigate('/change-email')}>Edit</button>
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
    </div>
  );
};

export default MyAccount;
