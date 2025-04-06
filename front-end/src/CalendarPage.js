import React, { useState, useEffect } from "react";
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

  const [showHelp, setShowHelp] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [intakeAmount, setIntakeAmount] = useState("Loading...");

 // Fetch hydration data when the component mounts or the selected date changes
 useEffect(() => {
  const fetchHydrationData = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/calendar');
      const data = await response.json();
      
      // Format selected date to 'YYYY-MM-DD' and match it with the data
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      const entry = data.find(item => item.date === selectedDateStr);
      
      if (entry) {
        // Convert the intake amount from milliliters to cups (1 cup = 240 ml)
        const intakeInCups = Math.ceil(entry.amount / 240); // Convert to cups and round to 2 decimal places
        setIntakeAmount(intakeInCups);
      } else {
        setIntakeAmount("No data for this date");
      }
    } catch (error) {
      console.error("Error fetching hydration data:", error);
      setIntakeAmount("Error loading data");
    }
  };

  fetchHydrationData();
}, [selectedDate]); 
  

  //adding for hamburger
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="calendar-page">
     
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
              <li onClick={() => { setShowHelp(true); setOpen(false); }}>Help</li>
              <li className="logout" onClick={() => { navigate("/Login"); setOpen(false); }}>Logout</li>
            </ul>
          </motion.div>
        </header>
              {/* this is for help */}
              {showHelp && (
            <motion.div 
              className="help-popup"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="help-message">
                <h2>HydroForest</h2>
                <p>
                  This app is designed to help you stay hydrated while growing a virtual forest. Here's how it works:
                </p>
        
                <h3>Daily 8 Cups Goal</h3>
                <p>
                  Your daily goal is to drink <strong>8 cups (2 liters)</strong> of water. Each time you log a cup of water, you help a plant in your virtual forest grow!
                </p>
        
                <h3>Unlocking Plants</h3>
                <p>
                  When you reach your daily goal of 8 cups, you unlock a new plant in your forest. These plants are unique and can be found in your forest collection. Keep hydrating to grow a lush and vibrant forest!
                </p>
        
                <h3> Forest Collection</h3>
                <p>
                  Visit your forest to see all the plants you've unlocked. Each plant represents a day you successfully met your hydration goal. The more consistent you are, the more diverse and beautiful your forest will become!
                </p>
        
                <button onClick={() => setShowHelp(false)}>Close</button>
              </div>
                </motion.div>
              )}
        

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
          {typeof intakeAmount === "number" ? `${intakeAmount} cups of water!` : intakeAmount}
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
