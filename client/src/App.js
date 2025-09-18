import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import BreatheScreen from './screens/BreatheScreen';
import BreathingSession from './screens/BreathingSession';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/breathe" element={<BreatheScreen />} />
          <Route path="/breathe/session" element={<BreathingSession />} />
          {/* Tutaj można dodać inne ścieżki dla kolejnych ćwiczeń */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;