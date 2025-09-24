import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ControlPanel from './ControlPanel';
import './Layout.scss';

const Layout = () => {
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ZMIANA: Tworzymy listę ścieżek, na których panel ma być ukryty
  const panelHiddenPaths = ['/', '/perspective'];

  const handleStartSession = () => {
    if (location.pathname === '/breathe') {
      setIsPlaying(true);
      setTimeout(() => {
        navigate('/breathe/session', { state: { duration: duration * 60 } });
        setIsPlaying(false);
      }, 300);
    }
  };

  return (
    // ZMIANA TUTAJ: Dodajemy dynamiczną klasę
    <div className="main-layout">
      <main className="content">
        <Outlet context={{ duration, setDuration }} />
      </main>

      {!panelHiddenPaths.includes(location.pathname) && (
        <ControlPanel 
          onPlayPause={handleStartSession} 
          isPlaying={isPlaying}
        />
      )}
    </div>
  );
};

export default Layout;