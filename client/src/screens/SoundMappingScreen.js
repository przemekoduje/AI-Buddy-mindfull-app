// src/screens/SoundMappingScreen.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SoundMappingScreen.scss"; // Stworzymy ten plik wkrótce
import CustomButton from "../components/CustomButton"; // Zakładam, że masz taki komponent

const SoundMappingScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: intro, 1: dalszy, 2: bliski, 3: wszystkie, 4: koniec
  const [displayContent, setDisplayContent] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Na wypadek przyszłych rozszerzeń AI

  const stepsContent = [
    {
      type: "intro",
      text: "Przygotuj się na ćwiczenie 'Mapa Dźwięków'. Pomoże Ci ono zakotwiczyć się w teraźniejszości poprzez słuch.",
      button: "Rozpocznij",
      duration: 0, // Intro bez timera, czeka na kliknięcie
    },
    {
      type: "guided",
      text: "Zamknij oczy. Skup się na swoim słuchu. Jaki jest najdalszy dźwięk, który jesteś w stanie usłyszeć? Wsłuchaj się w niego przez 20 sekund.",
      duration: 20000,
    },
    {
      type: "guided",
      text: "Teraz znajdź najbliższy dźwięk, jaki do Ciebie dociera. Może to szum komputera, bicie Twojego serca, dźwięk Twojego oddechu. Skup się na nim przez 20 sekund.",
      duration: 20000,
    },
    {
      type: "guided",
      text: "Na koniec, spróbuj usłyszeć wszystkie dźwięki pomiędzy tym najdalszym a najbliższym. Potraktuj je jak muzykę otoczenia, nie oceniając ich. Po prostu słuchaj.",
      duration: 30000, // Dłuższy czas na integrację
    },
    {
      type: "conclusion",
      text: "Dobra robota! Właśnie zakończyłeś ćwiczenie 'Mapa Dźwięków'. Zwracanie uwagi na dźwięki to świetny sposób na bycie tu i teraz.",
      button: "Zakończ sesję",
      duration: 0, // Koniec bez timera, czeka na kliknięcie
    },
  ];

  useEffect(() => {
    const currentStep = stepsContent[step];
    setDisplayContent(currentStep.text);
    setShowButton(currentStep.button ? true : false);

    if (currentStep.duration > 0) {
      const timer = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, currentStep.duration);
      return () => clearTimeout(timer); // Cleanup
    }
  }, [step]);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleFinishSession = () => {
    navigate("/"); // Powrót do ekranu głównego
  };

  const currentStepData = stepsContent[step];

  return (
    <div className="sound-mapping-screen">
      <div className="content-box">
        <p className="display-text">{displayContent}</p>
        {isLoading && (
          <div className="loader">
            {/* Tutaj będzie Twój nowy loader, zamiast trzech kropek */}
            {/* <div className="thinking-indicator"><span></span><span></span><span></span></div> */}
          </div>
        )}
      </div>

      {showButton && (
        <CustomButton
          onClick={
            currentStepData.type === "conclusion"
              ? handleFinishSession
              : handleNext
          }
        >
          {currentStepData.button}
        </CustomButton>
      )}
    </div>
  );
};

export default SoundMappingScreen;