import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BreatheScreen.scss';

const BreatheScreen = () => {
  const [duration, setDuration] = useState(1); // Domyślnie 1 minuta
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/breathe/session', { state: { duration: duration * 60 } }); // Przekaż czas w sekundach
  };

  return (
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

      <div className="breathe-screen__sound-grid">
        {/* Tutaj można zmapować ikony dźwięków */}
        <button className="sound-icon active">🔥</button>
        <button className="sound-icon">🌲</button>
        <button className="sound-icon">💧</button>
        {/* ... etc */}
      </div>

      <button className="play-button" onClick={handleStart}>
        ▶
      </button>
    </div>
  );
};

export default BreatheScreen;