import React, { useState, useEffect } from 'react';
import './ThoughtIntros.scss';

const ThoughtIntros = ({ onComplete }) => {
  const [thoughts, setThoughts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/get-example-thoughts');
        const data = await response.json();
        setThoughts(data);
      } catch (error) {
        console.error("Nie udało się pobrać myśli, używam zapasowych:", error);
        setThoughts([
          "...jestem do niczego.",
          "...zawsze wszystko psuję.",
          "...to się na pewno nie uda.",
          "...co oni sobie o mnie pomyślą?"
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThoughts();
  }, []);

  useEffect(() => {
    if (isLoading || thoughts.length === 0) return;
    setIsVisible(true);
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= thoughts.length) {
            clearInterval(interval);
            onComplete();
            return prevIndex;
          }
          setIsVisible(true);
          return nextIndex;
        });
      }, 600);
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading, thoughts, onComplete]);

  // ZMIANA TUTAJ: Modyfikujemy logikę renderowania
  return (
    <div className="intro-container">
      {isLoading ? (
        // Jeśli ładujemy, pokaż wskaźnik
        <div className="intro-loader">
          <span></span><span></span><span></span>
        </div>
      ) : (
        // Jeśli załadowano, pokaż animację myśli
        <div className={`intro-thought ${isVisible ? 'visible' : ''}`}>
          {thoughts[currentIndex]}
        </div>
      )}
    </div>
  );
};

export default ThoughtIntros;