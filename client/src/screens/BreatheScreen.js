import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './BreatheScreen.scss';

const techniques = [
  { id: 'box', name: 'Box Breathing', desc: '4s Inhale - 4s Hold - 4s Exhale - 4s Hold', phases: [4, 4, 4, 4] },
  { id: 'relax', name: 'Relaxing 4-7-8', desc: '4s Inhale - 7s Hold - 8s Exhale', phases: [4, 7, 8, 0] },
  { id: 'coherent', name: 'Coherent 5-5', desc: '5s Inhale - 5s Exhale', phases: [5, 0, 5, 0] },
  { id: 'cleansing', name: 'Cleansing 2-6', desc: '2s Inhale - 6s Exhale', phases: [2, 0, 6, 0] }
];

const themes = [
  { id: 'ocean', name: 'Ocean Wave', primary: '#5bc0be', glow: 'rgba(91, 192, 190, 0.45)' },
  { id: 'forest', name: 'Forest Glow', primary: '#86efac', glow: 'rgba(134, 239, 172, 0.45)' },
  { id: 'cosmic', name: 'Cosmic Dusk', primary: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)' }
];

const BreatheScreen = () => {
  const { setDuration } = useOutletContext();
  const navigate = useNavigate();

  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedTechnique, setSelectedTechnique] = useState('box');
  const [selectedTheme, setSelectedTheme] = useState('ocean');

  const handleStartSession = () => {
    setDuration(selectedDuration);
    navigate('/breathe/session', {
      state: {
        duration: selectedDuration * 60,
        technique: techniques.find(t => t.id === selectedTechnique),
        theme: themes.find(t => t.id === selectedTheme)
      }
    });
  };

  return (
    <div className="breathe-screen">
      <header className="breathe-screen__header">
        <h1 className="breathe-screen__title">Breathe</h1>
        <p className="breathe-screen__subtitle">Customize your moment of calm</p>
      </header>

      <div className="config-container glass-panel">
        {/* Section 1: Duration */}
        <div className="config-section">
          <h2 className="config-section__title">1. Choose Duration</h2>
          <div className="duration-selector-row">
            {[1, 2, 5].map((mins) => (
              <button 
                key={mins}
                onClick={() => setSelectedDuration(mins)} 
                className={`duration-circle ${selectedDuration === mins ? 'active' : ''}`}
              >
                <span className="duration-text">{mins}m</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Techniques */}
        <div className="config-section">
          <h2 className="config-section__title">2. Choose Technique</h2>
          <div className="technique-selector-grid">
            {techniques.map((tech) => (
              <button 
                key={tech.id}
                onClick={() => setSelectedTechnique(tech.id)}
                className={`technique-card ${selectedTechnique === tech.id ? 'active' : ''}`}
              >
                <h3 className="technique-card__name">{tech.name}</h3>
                <p className="technique-card__desc">{tech.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Themes */}
        <div className="config-section">
          <h2 className="config-section__title">3. Choose Atmosphere</h2>
          <div className="theme-selector-row">
            {themes.map((t) => (
              <button 
                key={t.id}
                onClick={() => setSelectedTheme(t.id)}
                className={`theme-circle-btn ${selectedTheme === t.id ? 'active' : ''}`}
                style={{ '--theme-color': t.primary }}
                title={t.name}
              >
                <span className="theme-indicator"></span>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button className="start-session-btn" onClick={handleStartSession}>
          Start Session
        </button>
      </div>
    </div>
  );
};

export default BreatheScreen;