import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BreathingAnimation.scss';

const BreathingAnimation = ({ isReady, text, countdown, scale, theme, isFadingOut }) => {
  const primaryColor = theme?.primary || '#5bc0be';
  const glowColor = theme?.glow || 'rgba(91, 192, 190, 0.45)';

  return (
    <div className="breathing-container">
      <AnimatePresence mode="wait">
        {!isReady ? (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.8, filter: "blur(8px)", y: -10 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="countdown-container"
          >
            <span className="countdown-number" style={{ textShadow: `0 0 40px ${primaryColor}` }}>
              {countdown === 4 ? "Ready?" : countdown}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="breathing-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: isFadingOut ? 0 : 1, 
              scale: isFadingOut ? 0.6 : 1 
            }}
            transition={{ 
              opacity: { duration: 2.2, ease: "easeInOut" },
              scale: { duration: 2.2, ease: "easeInOut" },
              default: { duration: 1.2, ease: "easeOut" }
            }}
            className="breathing-content-wrapper"
          >
            <div 
              className="breathing-circle"
              style={{ 
                transform: `scale(${scale})`,
                borderColor: `${primaryColor}33`, // 20% opacity border
                boxShadow: `
                  inset 0 25px 40px rgba(255, 255, 255, 0.2),
                  inset 0 1px 3px rgba(255, 255, 255, 0.3),
                  inset 0 -20px 40px rgba(0, 0, 0, 0.15),
                  0 30px 60px rgba(0, 0, 0, 0.25),
                  0 0 50px ${primaryColor}1a
                `
              }}
            >
              <div className="breathing-circle__highlight"></div>
              <div 
                className="breathing-circle__glow"
                style={{
                  background: `radial-gradient(circle, ${glowColor} 0%, ${primaryColor}0d 50%, rgba(0, 0, 0, 0) 70%)`
                }}
              ></div>
              <p className="breathing-text">{text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathingAnimation;