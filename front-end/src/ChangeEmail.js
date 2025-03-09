import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangeEmail.css';

const ChangeEmail = () => {
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const handleInputChange = () => {
    setIsSubmitEnabled(currentEmail.trim() && newEmail.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Verification email sent to: ${newEmail}`);
  };

  return (
    <div className="change-email-container">
      <button className="back-button" onClick={() => navigate('/')}>Back</button>
      <h1>Change Email</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="current-email">Current Email</label>
          <input
            type="email"
            id="current-email"
            value={currentEmail}
            onChange={(e) => {
              setCurrentEmail(e.target.value);
              handleInputChange();
            }}
            placeholder="Enter your current email"
          />
        </div>

        <div className="input-group">
          <label htmlFor="new-email">New Email</label>
          <input
            type="email"
            id="new-email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              handleInputChange();
            }}
            placeholder="Enter your new email"
          />
        </div>

        <p className="confirmation-message">
          A confirmation will be sent to your new email. Click the link inside
          to complete the update!
        </p>

        <button
          type="submit"
          className="submit-button"
          disabled={!isSubmitEnabled}
        >
          Send Verification
        </button>
      </form>
    </div>
  );
};

export default ChangeEmail;
