import React, { useState, useEffect } from 'react';
import './BreathingAnimation.scss';

const BreathingAnimation = () => {
  const [text, setText] = useState('Get ready...');
  const cycleTime = 8000; // 8 sekund na cykl (4 wdech, 4 wydech)

  useEffect(() => {
    // Ustaw tekst na "Wdech" (Inhale)
    setText('Inhale');
    
    // Ustaw interwał zmiany tekstu
    const interval = setInterval(() => {
      setText('Exhale');
      setTimeout(() => setText('Inhale'), cycleTime / 2);
    }, cycleTime);

    // Wyczyść interwał po odmontowaniu komponentu
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="breathing-container">
      <div className="breathing-circle"></div>
      <p className="breathing-text">{text}</p>
    </div>
  );
};

export default BreathingAnimation;