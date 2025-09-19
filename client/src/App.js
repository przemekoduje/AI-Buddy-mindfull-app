import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import BreatheScreen from './screens/BreatheScreen';
import BreathingSession from './screens/BreathingSession';
import Layout from './components/Layout'; // <-- Importujemy Layout

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Owijamy ścieżki, które mają mieć ControlPanel, w Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/breathe" element={<BreatheScreen />} />
            {/* Tutaj dodaj inne ekrany, które mają mieć panel */}
          </Route>
          
          {/* Ta ścieżka jest poza Layoutem, bo nie chcemy na niej panelu */}
          <Route path="/breathe/session" element={<BreathingSession />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;