// src/components/LoginPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
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
        {/* Logo */}
        <motion.img
          src="/images/logo/hydroforestlogo.png"
          alt="HydroForest Logo"
          className="login-logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
        />

        <h1 className="login-title">Welcome Back</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username */}
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

          {/* Password + Toggle */}
          <div className="password-wrapper">
            <motion.input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
              className="login-input password-input"
              required
              whileFocus={{ scale: 1.02 }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <p className="forgot-password-text" onClick={() => navigate("/forgotpassword")}>
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

        {/* Sign-Up Redirect */}
        <div className="signup-section">
          <p className="signup-text" onClick={() => navigate("/signup")}>
            Don't have an account? <span className="signup-link">Sign up!</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
