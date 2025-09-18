import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BreathingAnimation from '../components/BreathingAnimation';

const BreathingSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const durationInSeconds = location.state?.duration || 60; // Domyślnie 60s

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // Wróć do ekranu głównego po zakończeniu sesji
    }, durationInSeconds * 1000);

    return () => clearTimeout(timer);
  }, [durationInSeconds, navigate]);

  return (
    <div className="session-screen">
      <BreathingAnimation />
    </div>
  );
};

export default BreathingSession;