// src/screens/AnchorScreen.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AnchorScreen.scss"; // Stworzymy ten plik wkrótce
import CustomButton from "../components/CustomButton"; // Zakładam, że CustomButton jest już gotowy

const AnchorScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: intro, 1-5: 5-4-3-2-1, 6: koniec
  const [displayContent, setDisplayContent] = useState("");
  const [showStartButton, setShowStartButton] = useState(true); // Przycisk startowy dla intro
  const [showFinishButton, setShowFinishButton] = useState(false); // Przycisk zakończenia
  const [isLoading, setIsLoading] = useState(false); // Na wypadek przyszłych rozszerzeń AI

  const stepsContent = [
    {
      text: "Przygotuj się na ćwiczenie 'Kotwica'. Pomoże Ci ono natychmiastowo uziemić się w teraźniejszości, przerywając gonitwę myśli.",
      duration: 0, // Czeka na kliknięcie
    },
    {
      text: "Wymień w myślach 5 rzeczy, które widzisz wokół siebie.",
      duration: 15000,
    },
    {
      text: "Skup się na 4 doznaniach dotykowych (np. stopy na podłodze, materiał ubrania).",
      duration: 15000,
    },
    {
      text: "Wymień 3 dźwięki, które słyszysz (bliskie i dalekie).",
      duration: 15000,
    },
    {
      text: "Wyczuj 2 zapachy w swoim otoczeniu.",
      duration: 15000,
    },
    {
      text: "Skup się na 1 smaku, który czujesz w ustach.",
      duration: 10000,
    },
    {
      text: "Właśnie zakończyłeś ćwiczenie 'Kotwica'. Jesteś tu i teraz. Możesz wrócić do swoich zajęć.",
      duration: 0, // Czeka na kliknięcie 'Zakończ'
      isConclusion: true,
    },
  ];

  useEffect(() => {
    // Resetuj przyciski przed każdym nowym krokiem
    setShowStartButton(false);
    setShowFinishButton(false);

    const currentStepData = stepsContent[step];
    setDisplayContent(currentStepData.text);

    // Wyświetl przycisk startowy tylko dla pierwszego kroku
    if (step === 0) {
      setShowStartButton(true);
    } 
    // Wyświetl przycisk zakończenia tylko dla ostatniego kroku
    else if (currentStepData.isConclusion) {
      setShowFinishButton(true);
    }

    if (currentStepData.duration > 0) {
      const timer = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, currentStepData.duration);
      return () => clearTimeout(timer); // Cleanup timera
    } else if (step > 0 && !currentStepData.isConclusion) {
      // Jeśli to krok z zerową duracją, ale nie intro i nie konkluzja, 
      // i jest to np. ładowanie AI, możemy tu dodać logikę
      // Na razie po prostu czekamy na akcję użytkownika, jeśli to intro/konkluzja
    }

  }, [step]);

  const handleStart = () => {
    setStep(1); // Rozpoczyna sekwencję 5-4-3-2-1
  };

  const handleFinish = () => {
    navigate("/"); // Powrót do ekranu głównego
  };

  return (
    <div className="anchor-screen">
      <div className="content-box">
        <p className="display-text">{displayContent}</p>
        {isLoading && (
          <div className="loader">
            {/* Tutaj Twój nowy loader */}
          </div>
        )}
      </div>

      {showStartButton && (
        <CustomButton onClick={handleStart}>Rozpocznij Kotwicę</CustomButton>
      )}

      {showFinishButton && (
        <CustomButton onClick={handleFinish}>Zakończ sesję</CustomButton>
      )}
    </div>
  );
};

export default AnchorScreen;