// src/screens/ValuesCompassScreen.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton"; // Zakładam, że jest już gotowy
import "./ValuesCompassScreen.scss"; // Stworzymy ten plik wkrótce

const universalValues = [
  "Rozwój",
  "Spokój",
  "Rodzina",
  "Uczciwość",
  "Kreatywność",
  "Bezpieczeństwo",
  "Przygoda",
  "Zdrowie",
  "Natura",
  "Wolność",
  "Współpraca",
  "Akceptacja",
  "Wytrwałość",
  "Empatia",
];

const ValuesCompassScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("intro"); // "intro", "selectValue", "finalQuestion", "conclusion"
  const [selectedValue, setSelectedValue] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Na wypadek rozszerzeń AI

  useEffect(() => {
    if (step === "intro") {
      setDisplayText("Stoisz przed wyborem lub czujesz brak kierunku. Zatrzymaj się na chwilę.");
    } else if (step === "selectValue") {
      setDisplayText("Wybierz jedną wartość, która jest dla Ciebie najważniejsza w tym momencie:");
    } else if (step === "finalQuestion" && selectedValue) {
      setDisplayText(`Która decyzja lub które działanie przybliży Cię, nawet o milimetr, do Twojej wartości, jaką jest '${selectedValue}'?`);
      // Po wyświetleniu pytania, po chwili automatyczne zakończenie sesji
      const timer = setTimeout(() => {
        setStep("conclusion");
      }, 15000); // Dajemy 15 sekund na refleksję
      return () => clearTimeout(timer);
    } else if (step === "conclusion") {
      setDisplayText("Sesja zakończona. Pamiętaj o swojej wartości. Powrót do ekranu głównego.");
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000); // 3 sekundy na powrót
      return () => clearTimeout(timer);
    }
  }, [step, selectedValue, navigate]);

  const handleStartSelection = () => {
    setStep("selectValue");
  };

  const handleValueSelect = (value) => {
    setSelectedValue(value);
    setStep("finalQuestion");
  };

  return (
    <div className="values-compass-screen">
      <div className="content-box">
        <p className="display-text">{displayText}</p>

        {isLoading && (
          <div className="loader">
            {/* Tutaj Twój nowy loader */}
          </div>
        )}

        {step === "selectValue" && (
          <div className="values-list">
            {universalValues.map((value) => (
              <button
                key={value}
                className="value-pill"
                onClick={() => handleValueSelect(value)}
              >
                {value}
              </button>
            ))}
          </div>
        )}
      </div>

      {step === "intro" && (
        <CustomButton onClick={handleStartSelection}>Rozpocznij</CustomButton>
      )}
      {/* Przycisk zakończenia nie jest potrzebny, bo sesja kończy się automatycznie */}
    </div>
  );
};

export default ValuesCompassScreen;