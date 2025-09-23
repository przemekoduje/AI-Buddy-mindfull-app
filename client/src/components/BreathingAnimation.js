import React from 'react';
import './BreathingAnimation.scss';

const BreathingAnimation = ({ isReady, text, countdown, scale }) => {
  return (
    <div className="breathing-container">
      <div 
        className="breathing-circle"
        style={{ transform: `scale(${scale})` }}
      >
        {/* ZMIANA: Dodajemy dwa divy dla efektów świetlnych */}
        <div className="breathing-circle__highlight"></div>
        <div className="breathing-circle__glow"></div>
      </div>
      
      {!isReady && countdown ? (
        <p className="countdown-text">{countdown}</p>
      ) : (
        isReady && <p className="breathing-text">{text}</p>
      )}
    </div>
  );
};

export default BreathingAnimation;