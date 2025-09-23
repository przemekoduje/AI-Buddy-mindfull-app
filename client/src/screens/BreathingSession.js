import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BreathingAnimation from '../components/BreathingAnimation';
import ControlPanel from '../components/ControlPanel';
import './BreathingSession.scss';

const BreathingSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const durationInSeconds = location.state?.duration || 60;
  const cycleTimeMs = 8000; // 8 sekund w milisekundach

  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(durationInSeconds);
  const [countdown, setCountdown] = useState(4);
  
  // Stany do animacji JS
  const [text, setText] = useState('Inhale');
  const [scale, setScale] = useState(0.8);
  
  // Refy do zarządzania pętlą animacji
  const animationFrameId = useRef();
  const cycleStartTime = useRef(performance.now());
  const timePaused = useRef(0);

  // Efekt 1: Odliczanie (bez zmian)
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(p => (p <= 1 ? (clearInterval(countdownInterval), setIsReady(true), 0) : p - 1));
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  // Efekt 2: Pętla animacji i logiki (NOWA, GŁÓWNA LOGIKA)
  useEffect(() => {
    const animate = (timestamp) => {
      const elapsedSinceStart = timestamp - cycleStartTime.current;
      const progress = (elapsedSinceStart / cycleTimeMs) % 1; // Progres w cyklu 0..1

      // Obliczanie skali za pomocą funkcji sinus dla płynnego ruchu
      const newScale = 0.8 + 0.4 * (0.5 * Math.sin(progress * 2 * Math.PI - Math.PI / 2) + 0.5);
      setScale(newScale);

      // Zmiana tekstu jest idealnie zsynchronizowana
      setText(progress < 0.5 ? 'Inhale' : 'Exhale');

      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (isReady && !isPaused) {
      // Wznawianie: dostosuj czas startu o czas spędzony w pauzie
      cycleStartTime.current = performance.now() - timePaused.current;
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      // Pauza: zapisz, ile czasu minęło w bieżącym cyklu
      timePaused.current = performance.now() - cycleStartTime.current;
      cancelAnimationFrame(animationFrameId.current);
    }

    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isReady, isPaused]);

  // Efekt 3: Timer odliczania czasu sesji
  useEffect(() => {
    if (isReady && !isPaused && remainingTime > 0) {
      const remainingTimeInterval = setInterval(() => setRemainingTime(t => t - 1), 1000);
      return () => clearInterval(remainingTimeInterval);
    }
    if (remainingTime <= 0) navigate('/breathe');
  }, [isReady, isPaused, remainingTime, navigate]);

  const handlePlayPause = () => {
    if (isReady) setIsPaused(p => !p);
  };

  return (
    <div className="session-screen">
      <BreathingAnimation 
        isReady={isReady} 
        text={text} 
        countdown={countdown > 0 && countdown <= 3 ? countdown : null}
        scale={scale} // Przekazujemy aktualną skalę
      />
      <div className="session-screen__panel-wrapper">
        <ControlPanel onPlayPause={handlePlayPause} isPlaying={!isPaused} />
      </div>
    </div>
  );
};

export default BreathingSession;