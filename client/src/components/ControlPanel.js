import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ControlPanel.scss';
import focusIcon from '../assets/icons/focus reset_white.png';
import breatheIcon from '../assets/icons/breathe_white.png';
import momentSilence from '../assets/icons/MomentofSilence_white.png';
import perspective from '../assets/icons/perspective shift_white.png';
import dailyCompas from '../assets/icons/daily compas_white.png';
import bodyScan from '../assets/icons/body scan_white.png'
import shiftofGaze from '../assets/icons/shift of gaze_white.png'
import anchor from '../assets/icons/stone of worries_white.png'
// ZMIANA TUTAJ: Nowy układ przycisków
const panelButtons = [
  { id: 'focus', path: '/focus-reset', icon: focusIcon },
  null, // Miejsce na przycisk Play/Pause
  { id: 'breathe', path: '/breathe', icon: breatheIcon },
  { id: 'silence', path: '/moment-of-silence', icon: momentSilence },
  { id: 'perspective', path: '/perspective', icon: perspective },
  { id: 'anchor', path: '/anchor', icon: anchor },
  { id: 'compass', path: '/daily-compass', icon: dailyCompas },
  { id: 'scan', path: '/body-scan', icon: bodyScan },
  { id: 'gaze', path: '/shift-your-gaze', icon: shiftofGaze },
];

const ControlPanel = ({ onPlayPause, isPlaying }) => {
  const location = useLocation();

  return (
    <div className="control-panel">
      {panelButtons.map((button, index) => {
        
        // ZMIANA TUTAJ: Sprawdzamy, czy indeks to 1 (druga pozycja)
        if (index === 1) {
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
        
        // Reszta przycisków nawigacyjnych
        return (
          <Link
          key={button.id}
          to={button.path}
          className={`panel-button ${location.pathname === button.path ? 'active' : ''}`}
        >
          {/* ZMIANA TUTAJ: 
            Zamiast {button.icon} używamy tagu <img> 
          */}
          <img src={button.icon} alt={`${button.id} icon`} className="panel-icon" />
        </Link>
        );
      })}
    </div>
  );
};

export default ControlPanel;