import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangeEmail.css";
const ChangeEmail = () => {
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState(""); // Success/Error feedback
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const handleInputChange = () => {
    setIsSubmitEnabled(currentEmail.trim() && newEmail.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5005/api/ChangeEmail/change-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentEmail, newEmail }),
      });
      console.log("Submitting:", { currentEmail, newEmail });
      const data = await response.json();
      if (data.success) {
        setMessage("Email updated successfully!");
      } else {
        setMessage(data.message || "Email update failed.");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="entire-changeEmail-page">
      <div className="change-email-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate("/Account")}>
          Back
        </button>

        {/* Heading */}
        <h1 className="form-heading">Change Your Email</h1>

        <form onSubmit={handleSubmit}>
          {/* Current Email Field */}
          <div className="input-group-email">
            <label htmlFor="current-email" style={{ display: "block", height: "20px" }}>
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
          <div className="input-group-email">
            <label htmlFor="new-email" style={{ display: "block", height: "20px" }}>
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

          {/* Success/Error Message */}
          {message && <p className="confirmation-message">{message}</p>}

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={!isSubmitEnabled}>
            Update Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeEmail;


