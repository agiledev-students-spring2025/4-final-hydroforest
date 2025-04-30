import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="about-us-page"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="about-title">About HydroForest</h1>

      <motion.div 
        className="about-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="section-heading">Why We Built This</h2>
        <p>
          We wanted to help people stay hydrated and have fun doing it. 
          HydroForest turns your water intake into a vibrant digital forest — 
          grow trees as you drink and build healthy habits through visual rewards.
        </p>
      </motion.div>

      <motion.div 
        className="about-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="section-heading">The Dev Team</h2>
        <ul className="team-list">
          <li><a href="https://github.com/jljune9li" target="_blank" rel="noopener noreferrer">Jun Li</a></li>
          <li><a href="https://github.com/nataliovcharov" target="_blank" rel="noopener noreferrer">Natalie Ovcarov</a></li>
          <li><a href="https://github.com/danny031103" target="_blank" rel="noopener noreferrer">Daniel Brito</a></li>
          <li><a href="https://github.com/ns5190" target="_blank" rel="noopener noreferrer">Nabiha Siddique</a></li>
          <li><a href="https://github.com/AlvaroMartinezM" target="_blank" rel="noopener noreferrer">Alvaro Martinez</a></li>
        </ul>
      </motion.div>

      <button className="btn" onClick={() => navigate('/')}>
       Back to Home
      </button>
    </motion.div>
  );
};

export default AboutUs;
