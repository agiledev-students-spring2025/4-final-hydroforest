import React, { useState } from "react";
import Calendar from "react-calendar";
import { motion } from "framer-motion";
import "react-calendar/dist/Calendar.css"; 
import "./CalendarPage.css"; 

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 🌱 Mock past water intake log
  const waterIntakeLog = {
    "2024-03-01": 2.5, // Liters
    "2024-03-02": 3.0,
    "2024-03-03": 1.8,
    "2024-03-04": 2.2,
    "2024-03-05": 2.9
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  const intakeAmount = waterIntakeLog[formattedDate] || "No data available";

  return (
    <div className="calendar-page">
      {/* 🍃 Animated Background Vines */}
      <motion.div 
        className="plant-vine vine-left"
        animate={{ x: [0, 7, 0], rotate: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        🌿
      </motion.div>

      <motion.div 
        className="plant-vine vine-right"
        animate={{ x: [0, -7, 0], rotate: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
      >
        🌱
      </motion.div>

      <h1 className="page-title">Hydration Calendar </h1>

      {/* 📅 Animated Calendar */}
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
          maxDate={new Date()} // ❌ Disables future dates
        />
      </motion.div>

      {/* 💦 Water Intake Log (Animated) */}
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
    </div>
  );
};

export default CalendarPage;
