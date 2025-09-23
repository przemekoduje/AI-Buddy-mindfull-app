import React from 'react';
import { useOutletContext } from 'react-router-dom'; // <-- Importujemy hook
import './BreatheScreen.scss';

const BreatheScreen = () => {
  // Odczytujemy stan i funkcję z nadrzędnego Layout
  const { duration, setDuration } = useOutletContext();

  return (
    <div className="breathe-screen">
      <header className="breathe-screen__header">
        <h1 className="breathe-screen__title">Breathe</h1>
        <p className="breathe-screen__subtitle">How long should your moment of calm be?</p>
      </header>

      <div className="breathe-screen__duration-selector">
        {/* Przyciski teraz wywołują funkcję setDuration z Layout */}
        <button onClick={() => setDuration(1)} className={duration === 1 ? 'active' : ''}>
          1 minute
        </button>
        <button onClick={() => setDuration(2)} className={duration === 2 ? 'active' : ''}>
          2 minutes
        </button>
      </div>
    </div>
  );
};

export default BreatheScreen;