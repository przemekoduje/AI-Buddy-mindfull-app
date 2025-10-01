import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExternalObserverScreen.scss';

const questions = [
  { key: 'name', prompt: 'Nazwij emocję lub problem, który Cię dręczy.' },
  { key: 'shape', prompt: 'Gdyby miał(a) kształt, jaki by on był?' },
  { key: 'color', prompt: 'Gdyby miał(a) kolor?' },
  { key: 'temperature', prompt: 'Gdyby miał(a) temperaturę?' },
];

const ExternalObserverScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // Indeks aktualnego pytania
  const [attributes, setAttributes] = useState({ name: '', shape: '', color: '', temperature: '' });
  const [input, setInput] = useState('');
  const [isFading, setIsFading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsFading(true); // Rozpocznij animację znikania

    setTimeout(() => {
      // Zapisz odpowiedź
      const currentKey = questions[step].key;
      const newAttributes = { ...attributes, [currentKey]: input };
      setAttributes(newAttributes);
      
      setInput(''); // Wyczyść pole
      setStep(prev => prev + 1); // Przejdź do następnego kroku
      setIsFading(false); // Pokaż nowy krok
    }, 400); // Czas na animację
  };

  // Efekt do zakończenia sesji
  useEffect(() => {
    if (step >= questions.length) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 10000); // Pokaż podsumowanie przez 10 sekund
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  if (step >= questions.length) {
    // Widok podsumowania
    return (
      <div className="external-observer-screen conclusion">
        <p>
          Zauważ ten {attributes.color}, {attributes.temperature} {attributes.shape}. 
          To jest Twój '{attributes.name}'. On jest obok Ciebie, ale nie jest Tobą. 
          Możesz go obserwować z dystansu.
        </p>
      </div>
    );
  }

  return (
    <div className={`external-observer-screen ${isFading ? 'fading' : ''}`}>
      <label className="prompt-label">{questions[step].prompt}</label>
      <form onSubmit={handleSubmit} className="attribute-form">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className="attribute-input"
          placeholder="..."
        />
        <button type="submit" className="submit-arrow">→</button>
      </form>
    </div>
  );
};

export default ExternalObserverScreen;