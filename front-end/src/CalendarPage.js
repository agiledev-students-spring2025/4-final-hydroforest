import React, { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sling as Hamburger } from 'hamburger-react';


import "react-calendar/dist/Calendar.css"; 
import "./CalendarPage.css"; 

const CalendarPage = () => {
  //adding this for navigation
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL path


  const [selectedDate, setSelectedDate] = useState(new Date());


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const intakeAmount = "No data available";

  //adding for hamburger
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="calendar-page">
      
      {/* Animated Background Vines */}
      <motion.div 
        className="plant-vine vine-left"
        animate={{ x: [0, 10, 0], rotate: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        🌿
      </motion.div>

     
     <h1 className="calendar-title">Hydration Calendar</h1>
        <header className="calendar-header">
          <h1></h1>
          {/*  Hamburger Menu Button (Aligned Right) */}
          <div className="hamburger-menu">
            <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
          </div>

          {/*  Sliding Sidebar Menu */}
          <motion.div 
            className="sidebar-menu"
            initial={{ x: "100%" }} 
            animate={{ x: isOpen ? 0 : "100%" }} 
            transition={{ type: "tween", duration: 0.4 }}
          >
            <ul>
              <li onClick={() => { navigate("/Account"); setOpen(false); }}>My Account</li>
              <li onClick={() => { navigate("/AboutUs"); setOpen(false); }}>About Us</li>
              <li onClick={() => { navigate("/Help"); setOpen(false); }}>Help</li>
              <li className="logout" onClick={() => { navigate("/Login"); setOpen(false); }}>Logout</li>
            </ul>
          </motion.div>
        </header>
        

      {/* Animated Calendar */}
      <motion.div 
        className="calendar-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Calendar 
          onChange={handleDateChange} 
          value={selectedDate} 
          className="custom-calendar"
          maxDate={new Date()} //  Disables future dates
        />
      </motion.div>

      {/* Water Intake Log */}
      <motion.div 
        className="intake-overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p>Water Intake for {selectedDate.toDateString()}</p>
        <motion.p 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {typeof intakeAmount === "number" ? `${intakeAmount} Liters` : intakeAmount}
        </motion.p>
      </motion.div>

          {/* Bottom Navigation Bar */}
          <div className="navbar">
        <div className={`nav-item ${location.pathname === "/" ? "active" : ""}`} onClick={() => navigate("/")}>
          <img
              className="icon-image" 
              src="images/icon/home1.png"
              alt="Home" /> 
        </div>
        <div className={`nav-item ${location.pathname === "/Forest" ? "active" : ""}`} onClick={() => navigate("/Forest")}>
          <img
              className="icon-image" 
              src="images/icon/forest.png"
              alt="Forest" /> 
        </div>
        <div className={`nav-item ${location.pathname === "/Calendar" ? "active" : ""}`} onClick={() => navigate("/Calendar")}>
          <img
              className="icon-image" 
              src="images/icon/calendar.png"
              alt="Calendar" /> 
        </div>
        <div className={`nav-item ${location.pathname === "/Social" ? "active" : ""}`} onClick={() => navigate("/Social")}>
          <img
              className="icon-image" 
              src="images/icon/friend.png"
              alt="Social" /> 
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
