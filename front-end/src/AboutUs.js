import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="about-us-page"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="about-title">About Us</h1>
      <motion.div 
        className="about-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2>Project Overview</h2>
        <p>HydroForest is a web app designed to help users track their daily water intake while making hydration a fun and rewarding experience. Every time a user logs a bottle of water, a virtual tree grows in their digital forest. Over time, consistent hydration leads to a thriving forest, encouraging users to build healthy habits through gamification.</p>
      </motion.div>
      
      
      <motion.div 
        className="about-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2>Team Members</h2>
        <ul>
          <li><a href="https://github.com/jljune9li" target="_blank" rel="noopener noreferrer">Jun Li</a></li>
          <li><a href="https://github.com/nataliovcharov" target="_blank" rel="noopener noreferrer">Natalie Ovcarov</a></li>
          <li><a href="https://github.com/danny031103" target="_blank" rel="noopener noreferrer">Daniel Brito</a></li>
          <li><a href="https://github.com/ns5190" target="_blank" rel="noopener noreferrer">Nabiha Siddique</a></li>
          <li><a href="https://github.com/AlvaroMartinezM" target="_blank" rel="noopener noreferrer">Alvaro Martinez</a></li>
        </ul>
      </motion.div>
      
      <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
    </motion.div>
  );
};

export default AboutUs;