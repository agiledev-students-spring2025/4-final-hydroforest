import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterNewPassword, setReEnterNewPassword] = useState("");
  const [message, setMessage] = useState(""); // Success/Error feedback
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    setIsSubmitEnabled(
      currentPassword.trim() !== "" &&
      newPassword.trim() !== "" &&
      newPassword === reEnterNewPassword
    );
  }, [currentPassword, newPassword, reEnterNewPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const token = localStorage.getItem("token"); // Updated token retrieval
    console.log("JWT Token Sent:", token);

    try {
      const response = await fetch("http://localhost:5005/api/ChangePassword/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Updated token usage
        },
        body: JSON.stringify({ currentPassword, newPassword, reEnterNewPassword }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging log

      if (data.success) {
        setMessage("Password changed successfully!");
        setTimeout(() => {
          navigate("/Account");
        }, 1500); 
      } else {
        setMessage(data.message || "Password change failed.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessage("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="entire-change-password-page">
      <div className="change-password-container">
        <button className="back-button" onClick={() => navigate("/Account")}>
          Back
        </button>

        <h1 className="form-heading">Change Password</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="current-password" style={{ display: "block", height: "20px" }}>
              {/* Empty Label for Spacing */}
            </label>
            <input
              type="password"
              id="current-password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="new-password" style={{ display: "block", height: "20px" }}>
              {/* Empty Label for Spacing */}
            </label>
            <input
              type="password"
              id="new-password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="re-enter-new-password" style={{ display: "block", height: "20px" }}>
              {/* Empty Label for Spacing */}
            </label>
            <input
              type="password"
              id="re-enter-new-password"
              placeholder="Re-enter New Password"
              value={reEnterNewPassword}
              onChange={(e) => setReEnterNewPassword(e.target.value)}
            />
          </div>

          <p
            className="password-confirmation-message"
            style={{ visibility: message ? "visible" : "hidden" }}
          >
            {message || "placeholder"}
          </p>
          {/* {isLoading && <p className="loading-message">Processing...</p>} */}

          <button type="submit" className="submit-button" disabled={!isSubmitEnabled}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
