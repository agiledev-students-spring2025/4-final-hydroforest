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
    <div className="entire-change-password-page">
    <div className="change-password-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>
        Back
      </button>

      {/* Heading */}
      <h1 className="form-heading">Change Password</h1>

      <form onSubmit={handleSubmit}>
        {/* Current Password Field */}
        <div className="input-group">
          <label htmlFor="current-password" style={{ display: 'block', height: '20px' }}>
            {/* Empty Label for Spacing */}
          </label>
          <input
            type="password"
            id="current-password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              handleInputChange();
            }}
          />
        </div>

        {/* New Password Field */}
        <div className="input-group">
          <label htmlFor="new-password" style={{ display: 'block', height: '20px' }}>
            {/* Empty Label for Spacing */}
          </label>
          <input
            type="password"
            id="new-password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              handleInputChange();
            }}
          />
        </div>

        {/* Re-enter New Password Field */}
        <div className="input-group">
          <label htmlFor="re-enter-new-password" style={{ display: 'block', height: '20px' }}>
            {/* Empty Label for Spacing */}
          </label>
          <input
            type="password"
            id="re-enter-new-password"
            placeholder="Re-enter New Password"
            value={reEnterNewPassword}
            onChange={(e) => {
              setReEnterNewPassword(e.target.value);
              handleInputChange();
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-button"
          disabled={!isSubmitEnabled}
        >
          Submit
        </button>
      </form>
    </div>

    </div>
  );
};

export default ChangePassword;
