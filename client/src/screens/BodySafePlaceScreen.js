import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BodySafePlaceScreen.scss';

const BodySafePlaceScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('intro'); // 'intro', 'scan', 'question', 'focus', 'conclusion'
  const [displayText, setDisplayText] = useState('');
  const [input, setInput] = useState('');
  const [safePlace, setSafePlace] = useState('');
  const [progress, setProgress] = useState(0); // Dla paska postępu
  const [isFading, setIsFading] = useState(false);

  // Efekt do zarządzania krokami i timerami
  useEffect(() => {
    let timer;
    let progressInterval;

    const handleStepChange = (newStep) => {
      setIsFading(true);
      setTimeout(() => {
        setStep(newStep);
        setIsFading(false);
      }, 400); // Czas na animację znikania
    };

    switch (step) {
      case 'intro':
        setDisplayText("Przygotuj się na ćwiczenie 'Bezpieczne Miejsce w Ciele'. Znajdziemy w nim ukojenie.");
        timer = setTimeout(() => handleStepChange('scan'), 5000); // 5s na przeczytanie intro
        break;
      case 'scan':
        setDisplayText("Przeskanuj powoli w myślach swoje ciało, od stóp do głowy. Znajdź jedno miejsce, które czuje się neutralnie, spokojnie, a może nawet przyjemnie.");
        timer = setTimeout(() => handleStepChange('question'), 20000); // 20s na skanowanie
        break;
      case 'question':
        setDisplayText("Gdzie znalazłeś/aś to miejsce?");
        break; // Czeka na input użytkownika
      case 'focus':
        setDisplayText(`Skieruj całą swoją uwagę na ${safePlace} na 60 sekund. Poczuj wszystkie doznania, które się tam znajdują. Pozwól, by to uczucie stało się Twoją kotwicą.`);
        setProgress(0); // Resetuj pasek
        const totalDuration = 60000;
        const intervalTime = 100; // Aktualizuj co 100ms
        let elapsed = 0;

        progressInterval = setInterval(() => {
          elapsed += intervalTime;
          setProgress((elapsed / totalDuration) * 100);
          if (elapsed >= totalDuration) {
            clearInterval(progressInterval);
            handleStepChange('conclusion');
          }
        }, intervalTime);
        break;
      case 'conclusion':
        setDisplayText("Dobra robota! Właśnie aktywowałeś/aś swoje bezpieczne miejsce. Możesz wracać do swoich zajęć, niosąc ze sobą to uczucie spokoju.");
        timer = setTimeout(() => navigate('/'), 5000); // 5s, a potem powrót do home
        break;
      default:
        break;
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [step, navigate, safePlace]); // Dodano safePlace do zależności, by odświeżyć tekst

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && step === 'question') {
      setSafePlace(input.trim());
      setInput('');
      setStep('focus');
    }
  };

  return (
    <div className={`body-safe-place-screen ${isFading ? 'fading' : ''}`}>
      <div className="content-box">
        <p className="display-text">{displayText}</p>

        {step === 'question' && (
          <form onSubmit={handleSubmit} className="safe-place-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              className="safe-place-input"
              placeholder="np. dłonie, brzuch, stopy..."
            />
            <button type="submit" className="submit-arrow">→</button>
          </form>
        )}

        {step === 'focus' && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodySafePlaceScreen;