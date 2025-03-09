import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reEnterNewPassword, setReEnterNewPassword] = useState('');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const handleInputChange = () => {
    setIsSubmitEnabled(
      currentPassword.trim() &&
      newPassword.trim() &&
      newPassword === reEnterNewPassword
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Password changed successfully!');
  };

  return (
    <div className="change-password-container">
      <button className="back-button" onClick={() => navigate('/')}>Back</button>
      <h1>Change Password</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              handleInputChange();
            }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              handleInputChange();
            }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="re-enter-new-password">Re-enter New Password</label>
          <input
            type="password"
            id="re-enter-new-password"
            value={reEnterNewPassword}
            onChange={(e) => {
              setReEnterNewPassword(e.target.value);
              handleInputChange();
            }}
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!isSubmitEnabled}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

