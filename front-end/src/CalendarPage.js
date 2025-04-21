import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sling as Hamburger } from "hamburger-react";

import "react-calendar/dist/Calendar.css";
import "./CalendarPage.css";

const CalendarPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedDate, setSelectedDate] = useState(null);
  const [intakeAmount, setIntakeAmount] = useState("Loading...");
  const [showHelp, setShowHelp] = useState(false);
  const [isOpen, setOpen] = useState(false);

  function getEasternTodayDate() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);

    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;

    return new Date(`${year}-${month}-${day}T00:00:00`);
  }

  function getEasternDateStringFromDate(date) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    setSelectedDate(getEasternTodayDate());
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchHydrationData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5005/api/calendar", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Unauthorized or failed to fetch");
        }

        const { hydrationData } = await response.json();
        const selectedDateStr = getEasternDateStringFromDate(selectedDate);

        const entry = hydrationData.find((item) =>
          item.date.startsWith(selectedDateStr)
        );

        if (entry) {
          const intakeInCups = Math.round(entry.amount / 240);
          setIntakeAmount(`${intakeInCups} cups of water!`);
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

  return (
    <div className="calendar-page">
      <h1 className="calendar-title">Hydration Calendar</h1>
      <header className="calendar-header">
        <h1></h1>
        <div className="hamburger-menu">
          <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
        </div>
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
            <li className="logout" onClick={() => { localStorage.clear(); navigate("/Login"); setOpen(false); }}>Logout</li>
            </ul>
        </motion.div>
      </header>

      {showHelp && (
        <motion.div
          className="help-popup"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="help-message">
            <h2>HydroForest</h2>
            <p>This app helps you stay hydrated while growing a virtual forest!</p>
            <p>Your goal is to drink 8 cups of water a day and unlock trees 🌳</p>
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
        </motion.div>
      )}

      <motion.div className="calendar-container">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          maxDate={new Date()}
          className="custom-calendar"
        />
      </motion.div>

      <motion.div className="intake-overview">
        <p>Water Intake for {selectedDate?.toDateString()}</p>
        <p>{intakeAmount}</p>
      </motion.div>

      <div className="navbar">
        <div className={`nav-item ${location.pathname === "/" ? "active" : ""}`} onClick={() => navigate("/")}>
          <img className="icon-image" src="images/icon/home1.png" alt="Home" />
        </div>
        <div className={`nav-item ${location.pathname === "/Forest" ? "active" : ""}`} onClick={() => navigate("/Forest")}>
          <img className="icon-image" src="images/icon/forest.png" alt="Forest" />
        </div>
        <div className={`nav-item ${location.pathname === "/Calendar" ? "active" : ""}`} onClick={() => navigate("/Calendar")}>
          <img className="icon-image" src="images/icon/calendar.png" alt="Calendar" />
        </div>
        <div className={`nav-item ${location.pathname === "/Social" ? "active" : ""}`} onClick={() => navigate("/Social")}>
          <img className="icon-image" src="images/icon/friend.png" alt="Social" />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
