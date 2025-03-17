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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your password reset logic here
    setMessage("If this email is registered, you will receive a password reset link shortly.");
    console.log("Password reset request for:", email);
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

