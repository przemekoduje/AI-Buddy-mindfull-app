import React, { useState } from 'react';
// Usunięto import useNavigate i ControlPanel
import './BreatheScreen.scss';

const BreatheScreen = () => {
  const [duration, setDuration] = useState(1);
  // Usunięto stan isPlaying i funkcję handleStart - teraz są w Layout

  return (
    // Zauważ, że nie ma tu już komponentu <ControlPanel />
    <div className="breathe-screen">
      <header className="breathe-screen__header">
        <h1 className="breathe-screen__title">Breathe</h1>
        <p className="breathe-screen__subtitle">How long should your moment of calm be?</p>
      </header>

      <div className="breathe-screen__duration-selector">
        <button onClick={() => setDuration(1)} className={duration === 1 ? 'active' : ''}>
          1 minute
        </button>
        <button onClick={() => setDuration(2)} className={duration === 2 ? 'active' : ''}>
          2 minutes
        </button>
      </div>
      
      {/* Puste miejsce po panelu, który jest teraz na stałe na dole ekranu */}
    </div>
  );
};

export default BreatheScreen;