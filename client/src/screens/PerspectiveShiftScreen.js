import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PerspectiveShiftScreen.scss";
import ThoughtIntros from "../components/ThoughtIntros";

const PerspectiveShiftScreen = () => {
  const navigate = useNavigate();

  // === GŁÓWNE STANY STERUJĄCE ===
  const [step, setStep] = useState("intro"); // Główny kontroler widoku
  const [displayText, setDisplayText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [textIsVisible, setTextIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // === STANY PRZECHOWUJĄCE DANE ===
  const [input, setInput] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [negativeThought, setNegativeThought] = useState("");
  const [aiConclusion, setAiConclusion] = useState(null); // Będzie przechowywać obiekt JSON

  const handleIntroComplete = () => {
    setStep("inputNegative");
    setDisplayText("A Tobie jaka myśl teraz ciąży?");
    setShowInput(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage = { role: "user", content: input };
    const updatedHistory = [...messageHistory, newUserMessage];

    // Zapisujemy pierwszą myśl, aby móc ją później przekazać do animacji (jeśli wrócimy do tego pomysłu)
    if (step === "inputNegative") {
      setNegativeThought(input);
    }

    setMessageHistory(updatedHistory);
    setShowInput(false);
    setTextIsVisible(false);
    setIsLoading(true);

    setTimeout(async () => {
      let endpoint = "";
      let payload = {};

      if (step === "inputNegative") {
        endpoint = "/api/get-reframing-question";
        payload = { thought: input };
      } else if (step === "inputPositive") {
        endpoint = "/api/get-conclusion";
        payload = {
          negative_thought: negativeThought,
          reframed_thought: input, // To jest odpowiedź użytkownika na pytanie AI
        };
      }

      try {
        const response = await fetch(`http://localhost:5001${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
      
        setIsLoading(false);
      
        if (step === 'inputNegative') {
            const question = data.question;
            setMessageHistory(prev => [...prev, { role: "assistant", content: question }]);
            setDisplayText(question);
            setTextIsVisible(true);
            setShowInput(true);
            setStep('inputPositive');
        } else if (step === 'inputPositive') {
            // Otrzymujemy obiekt JSON i ustawiamy go w stanie
            setAiConclusion(data); 
            setStep('showConclusion');
        }
      } catch (error) {
        console.error("Błąd serwera:", error);
        setIsLoading(false);
        setShowInput(true); 
      }
    }, 500);
    setInput("");
  };

  const handleFinish = () => {
    navigate("/");
  };

  return (
    <div className="perspective-screen">
      {step === "intro" && <ThoughtIntros onComplete={handleIntroComplete} />}

      {(step === "inputNegative" || step === "inputPositive") && (
        <>
          <div className="display-text-area">
            {isLoading ? (
              <div className="thinking-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              <div
                className={`text-content ${
                  textIsVisible ? "visible" : "hidden"
                }`}
              >
                {displayText}
              </div>
            )}
          </div>
          {showInput && (
            <form
              onSubmit={handleSendMessage}
              className="thought-form single-view"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Wpisz tutaj..."
                disabled={isLoading}
                autoFocus
              />
              <button type="submit" disabled={isLoading || !input.trim()}>
                Wyślij
              </button>
            </form>
          )}
        </>
      )}

      {step === "showConclusion" && aiConclusion && (
        <div className="conclusion-card glass-panel">
          <header className="conclusion-header">
            <h2 className="conclusion-title">Podsumowanie Sesji</h2>
            <p className="conclusion-subtitle">Twój shift perspektywy</p>
          </header>

          <div className="conclusion-grid">
            <div className="conclusion-section pattern-section">
              <span className="section-label">Zidentyfikowany Wzorzec</span>
              <h3 className="section-title">{aiConclusion.diagnosisTitle}</h3>
              <p className="section-text">{aiConclusion.diagnosisText}</p>
            </div>

            <div className="conclusion-section tool-section">
              <span className="section-label">Zalecane Narzędzie</span>
              <h3 className="section-title">{aiConclusion.toolTitle}</h3>
              <p className="section-text">{aiConclusion.toolText}</p>
            </div>

            <div className="conclusion-section insight-section">
              <span className="section-label">Nowa Perspektywa / Wniosek</span>
              <p className="section-text">{aiConclusion.discoveryText}</p>
            </div>
          </div>

          <div className="conclusion-reflection">
            <span className="reflection-label">Kluczowe Pytanie / Refleksja</span>
            <p className="reflection-question">"{aiConclusion.keyQuestion}"</p>
          </div>

          <button onClick={handleFinish} className="finish-button">
            Powrót do menu głównego
          </button>
        </div>
      )}
    </div>
  );
};

export default PerspectiveShiftScreen;
