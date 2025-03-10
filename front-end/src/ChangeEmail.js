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
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>
        Back
      </button>

      {/* Heading */}
      <h1 className="form-heading">Change Your Email</h1>

      <form onSubmit={handleSubmit}>
        {/* Current Email Field */}
        <div className="input-group">
          <label htmlFor="current-email" style={{ display: 'block', height: '20px' }}>
            {/* Empty label for spacing */}
          </label>
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

        {/* New Email Field */}
        <div className="input-group">
          <label htmlFor="new-email" style={{ display: 'block', height: '20px' }}>
            {/* Empty label for spacing */}
          </label>
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

        {/* Confirmation Message */}
        <p className="confirmation-message">
          A confirmation will be sent to your new email. Click the link inside to complete the update!
        </p>

        {/* Submit Button */}
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
