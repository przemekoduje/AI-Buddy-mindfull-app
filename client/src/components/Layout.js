import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import ControlPanel from './ControlPanel';
import './Layout.scss';

const Layout = () => {
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
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
    <div className="main-layout">
      <AnimatePresence>
        {!isHome && (
          <motion.header 
            className="top-navigation glass-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="back-button">
              <ChevronLeft size={24} />
              <span>Home</span>
            </Link>
          </motion.header>
        )}
      </AnimatePresence>

      <main className={`content ${isHome ? 'is-home' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="page-transition-container"
          >
            <Outlet context={{ duration, setDuration }} />
          </motion.div>
        </AnimatePresence>
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