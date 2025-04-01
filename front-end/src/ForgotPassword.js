import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5005/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
  
      const data = await response.json();
      setMessage(data.message);
      console.log("Forgot password request:", data);
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };
  

  const handleReturnToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="forgot-password-page">
      <motion.div 
        className="forgot-password-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="forgot-password-title">Forgot Password</h1>
        <p className="forgot-password-text">
          Enter your email and we'll send you instructions.
        </p>
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
            className="forgot-password-input"
            required
          />
          <button type="submit" className="forgot-password-btn">Reset Password</button>
        </form>
        {message && <p className="forgot-password-message">{message}</p>}
        <button onClick={handleReturnToLogin} className="return-login-btn">
          Return to Login
        </button>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

