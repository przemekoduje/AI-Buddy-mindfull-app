import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ControlPanel from './ControlPanel';
import './Layout.scss';

const Layout = () => {
  const [duration, setDuration] = useState(1); // <-- Stan przeniesiony tutaj
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleStartSession = () => {
    // Sprawdzamy, na jakiej stronie jesteśmy, aby uruchomić odpowiednią sesję
    if (location.pathname === '/breathe') {
      setIsPlaying(true);
      setTimeout(() => {
        // Przekazujemy stan 'duration' do sesji oddechowej
        navigate('/breathe/session', { state: { duration: duration * 60 } });
        setIsPlaying(false); // Resetujemy stan po przejściu
      }, 300);
    }
    // W przyszłości można dodać: else if (location.pathname === '/focus-reset') { ... }
  };

  return (
    <div className="main-layout">
      <main className="content">
        <Outlet context={{ duration, setDuration }} />
      </main>
      <ControlPanel 
        onPlayPause={handleStartSession} 
        isPlaying={false} // <-- Na ekranach ustawień przycisk nigdy nie jest "aktywny"
      />
    </div>
  );
};

export default Layout;