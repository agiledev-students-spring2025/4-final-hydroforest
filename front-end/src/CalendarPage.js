import React, { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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



      <h1 className="calendar-title">Hydration Calendar </h1>

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
        <h3>Water Intake for {selectedDate.toDateString()}</h3>
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
        <span>Home</span>
      </div>
      <div className={`nav-item ${location.pathname === "/Forest" ? "active" : ""}`} onClick={() => navigate("/Forest")}>
        <span>Forest</span>
      </div>
      <div className={`nav-item ${location.pathname === "/Calendar" ? "active" : ""}`} onClick={() => navigate("/Calendar")}>
        <span>Calendar</span>
      </div>
      <div className={`nav-item ${location.pathname === "/Social" ? "active" : ""}`} onClick={() => navigate("/Social")}>
        <span>Social</span>
      </div>
    </div>
    </div>
  );
};

export default CalendarPage;
