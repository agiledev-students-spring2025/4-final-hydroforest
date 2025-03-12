import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate(); // Allows redirection

  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //  Simulating authentication (replace with real auth logic)
    if (credentials.username && credentials.password) {
      console.log("Logging in with:", credentials);

      //  Redirect to Homepage
      navigate("/");
    } else {
      console.log("Invalid credentials");
      alert("Please enter both username and password!");
    }
  };

  return (
    <div className="login-page">
      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="login-title">Welcome Back</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <motion.input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleInputChange}
            className="login-input"
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
            className="login-input"
            required
            whileFocus={{ scale: 1.02 }}
          />
          
          <p 
            className="forgot-password-text"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot Password?
          </p>

          <motion.button 
            type="submit" 
            className="login-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Log In
          </motion.button>
        </form>

        {/* 🔹 Sign-Up Redirect */}
        <div className="signup-section">
          <p 
            className="signup-text"
            onClick={() => navigate("/signup")}
          >
            Don't have an account? <span className="signup-link">Sign up!</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
