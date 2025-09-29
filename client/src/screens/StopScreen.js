import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StopScreen.scss'; // Stworzymy ten plik za chwilę

const stopSteps = [
  { letter: 'S', title: 'Stop', instruction: 'Zatrzymaj się. Weź świadomą pauzę od tego, co robisz.', duration: 5000 },
  { letter: 'T', title: 'Take a breath', instruction: 'Skup się na trzech głębokich oddechach. Poczuj, jak powietrze wchodzi i wychodzi.', duration: 15000 },
  { letter: 'O', title: 'Observe', instruction: 'Co czujesz w swoim ciele? Jakie myśli krążą w głowie? Jakie emocje odczuwasz? Nazwij je w myślach, bez oceniania.', duration: 20000 },
  { letter: 'P', title: 'Proceed', instruction: 'Mając te informacje, jak chcesz świadomie kontynuować swój dzień?', duration: 10000 },
];

const StopScreen = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (stepIndex >= stopSteps.length) {
      // Jeśli to koniec, wróć do strony głównej
      navigate('/');
      return;
    }

    const currentStep = stopSteps[stepIndex];
    const timer = setTimeout(() => {
      setIsFadingOut(true); // Rozpocznij animację znikania
      setTimeout(() => {
        setStepIndex(prev => prev + 1);
        setIsFadingOut(false); // Pokaż nowy krok
      }, 500); // Czas na animację
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [stepIndex, navigate]);

  const currentStep = stopSteps[stepIndex];

  // Jeśli nie ma już kroków, nie renderuj nic (na chwilę przed nawigacją)
  if (!currentStep) {
    return null;
  }

  return (
    <div className={`stop-screen ${isFadingOut ? 'fading-out' : ''}`}>
      <div className="step-letter">{currentStep.letter}</div>
      <div className="step-content">
        <h2 className="step-title">{currentStep.title}</h2>
        <p className="step-instruction">{currentStep.instruction}</p>
        {currentStep.letter === 'T' && <div className="pulsing-dot"></div>}
      </div>
    </div>
  );
};

export default StopScreen;