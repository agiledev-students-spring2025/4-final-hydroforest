import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5005/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Signup successful:", data);
        navigate("/login"); // Go to login page
      } else {
        console.error("Signup error:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="signup-page">
      <motion.div 
        className="signup-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="signup-title">Create an Account</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <motion.input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="signup-input"
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="signup-input"
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="signup-input"
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button 
            type="submit" 
            className="signup-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>
        </form>

        {/* Centered Already Have an Account? */}
        <div className="login-section">
          <p 
            className="login-text"
            onClick={() => navigate("/login")}
          >
            Already have an account? <span className="login-link">Log in!</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
