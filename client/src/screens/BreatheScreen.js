import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ControlPanel from '../components/ControlPanel'; // <-- Importujemy komponent
import './BreatheScreen.scss';

const BreatheScreen = () => {
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false); // <-- Stan dla przycisku Play
  const navigate = useNavigate();

  // Ta funkcja uruchomi ćwiczenie i zmieni stan przycisku
  const handleStart = () => {
    setIsPlaying(true);
    // Małe opóźnienie dla efektu wizualnego
    setTimeout(() => {
      navigate('/breathe/session', { state: { duration: duration * 60 } });
    }, 300);
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

      {/* PODMIANA STAREGO KODU NA NOWY KOMPONENT */}
      <ControlPanel 
        onPlayPause={handleStart} 
        isPlaying={isPlaying} 
      />

    </div>
  );
};

export default BreatheScreen;