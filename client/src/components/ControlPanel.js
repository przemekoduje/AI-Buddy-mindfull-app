import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ControlPanel.scss';

// Załóżmy, że mamy taką strukturę przycisków
// W praktyce ikony byłyby importowanymi komponentami SVG lub z biblioteki
const panelButtons = [
  { id: 'focus', path: '/focus-reset', icon: '🎯' },
  { id: 'breathe', path: '/breathe', icon: '🧘' },
  { id: 'silence', path: '/moment-of-silence', icon: '🤫' },
  { id: 'perspective', path: '/perspective', icon: '🌌' },
  null, // Puste miejsce na przycisk Play/Pause
  { id: 'anchor', path: '/anchor', icon: '⚓️' },
  { id: 'compass', path: '/daily-compass', icon: '🧭' },
  { id: 'scan', path: '/body-scan', icon: '👤' },
  { id: 'gaze', path: '/shift-your-gaze', icon: '👀' },
];

const ControlPanel = ({ onPlayPause, isPlaying }) => {
  const location = useLocation();

  return (
    <div className="control-panel">
      {panelButtons.map((button, index) => {
        if (index === 4) { // Centralny przycisk Play/Pause
          return (
            <button
              key="play-pause"
              className={`panel-button play-button ${isPlaying ? 'active' : ''}`}
              onClick={onPlayPause}
            >
              ▶
            </button>
          );
        }
        
        // Zwykłe przyciski nawigacyjne
        return (
          <Link
            key={button.id}
            to={button.path}
            className={`panel-button ${location.pathname === button.path ? 'active' : ''}`}
          >
            {button.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default ControlPanel;
