import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./HydrationTipRotate.css";

const tips = [
  "Drink a glass of water first thing in the morning.",
  "Keep a reusable bottle at your desk.",
  "Flavor your water with lemon or cucumber slices.",
  "Set a timer to sip every 30 minutes.",
  "Swap one coffee for water each day."
];

export default function HydrationTipsModal() {
  const [open, setOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 10000); // switch every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="tip-banner" onClick={() => setOpen(true)}>
        <AnimatePresence mode="wait">
          <motion.span
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
             {tips[tipIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, y: -50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button className="modal-close" onClick={() => setOpen(false)}>×</button>
              <h2>Hydration Tips</h2>
              <ul className="tip-list">
                {tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
