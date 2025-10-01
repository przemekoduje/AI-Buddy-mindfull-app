import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ValuesCompassScreen.scss'; 

const ValuesCompassScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('chat'); // 'chat', 'finalQuestion', 'conclusion'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [finalValue, setFinalValue] = useState('');
  const [displayText, setDisplayText] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    // Efekt do auto-scrollowania czatu
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Efekt sterujący krokami po zakończeniu czatu
    if (step === 'finalQuestion' && finalValue) {
      setDisplayText(`Która decyzja lub które działanie przybliży Cię, nawet o milimetr, do Twojej wartości, jaką jest '${finalValue}'?`);
      const timer = setTimeout(() => setStep('conclusion'), 15000); // 15s na refleksję
      return () => clearTimeout(timer);
    } else if (step === 'conclusion') {
      setDisplayText("Sesja zakończona. Pamiętaj o swojej wartości.");
      const timer = setTimeout(() => navigate('/'), 3000); // 3s na powrót
      return () => clearTimeout(timer);
    }
  }, [step, finalValue, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Używamy endpointu czatu z naszego nowego, połączonego backendu
      const response = await fetch('http://localhost:5001/api/chat/values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.ai_response };
      setMessages(prev => [...prev, aiMessage]);

      // Sprawdzamy, czy AI zakończyło dialog, szukając pogrubionego tekstu **wartość**
      const match = data.ai_response.match(/\*\*(.*?)\*\*/);
      if (match && match[1]) {
        setFinalValue(match[1]); // Wyciągamy wartość z odpowiedzi AI (np. "Bezpieczeństwo")
        setTimeout(() => setStep('finalQuestion'), 2000); // Dajemy chwilę na przeczytanie i przechodzimy dalej
      }
    } catch (error) {
      console.error("Błąd serwera:", error);
      const errorMessage = { role: 'assistant', content: "Przepraszam, mam problem z połączeniem." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderowanie widoku po zakończeniu czatu
  if (step !== 'chat') {
    return (
      <div className="values-compass-screen">
        <div className="content-box">
          <p className="display-text">{displayText}</p>
        </div>
      </div>
    );
  }

  // Renderowanie widoku czatu
  return (
    <div className="values-compass-screen chat-view">
      <div className="chat-history">
        {messages.length === 0 && <p className="chat-placeholder">Opisz krótko sytuację lub wybór, przed którym stoisz...</p>}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`} dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        ))}
        {isLoading && <div className="message assistant loading"><span></span><span></span><span></span></div>}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="thought-form chat-form">
        <textarea 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Opowiedz AI o swojej sytuacji..."
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
          disabled={isLoading}
          autoFocus 
        />
        <button type="submit" disabled={isLoading || !input.trim()}>Wyślij</button>
      </form>
    </div>
  );
};

export default ValuesCompassScreen;