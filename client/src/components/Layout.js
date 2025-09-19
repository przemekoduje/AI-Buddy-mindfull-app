import React from 'react';
import { Outlet } from 'react-router-dom';
import ControlPanel from './ControlPanel';
import './Layout.scss';

const Layout = () => {
  // Przekazujemy puste funkcje, bo na razie nie podpinamy logiki play/pause
  // W przyszłości stan `isPlaying` byłby zarządzany globalnie (np. przez Context API)
  const handlePlayPause = () => {
    console.log("Play/Pause clicked");
  };

  return (
    <div className="main-layout">
      <main className="content">
        <Outlet /> {/* Tutaj będą renderowane nasze ekrany, np. HomeScreen, BreatheScreen */}
      </main>
      <ControlPanel 
        onPlayPause={handlePlayPause} 
        isPlaying={false} 
      />
    </div>
  );
};

export default Layout;