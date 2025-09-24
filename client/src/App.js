import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import HomeScreen from './screens/HomeScreen';
import BreatheScreen from './screens/BreatheScreen';
import BreathingSession from './screens/BreathingSession';
import Layout from './components/Layout';
import PerspectiveShiftScreen from './screens/PerspectiveShiftScreen';

// Komponent z logiką routingu musi być wewnątrz Routera, więc go zostawiamy
const AppContent = () => {
  const location = useLocation();
  
  return (
    // ZMIANA: Przenosimy dynamiczną klasę tutaj
    <div className={`app-container ${location.pathname === '/' ? 'homepage' : ''}`}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/breathe" element={<BreatheScreen />} />
          <Route path="/perspective" element={<PerspectiveShiftScreen />} />
        </Route>
        <Route path="/breathe/session" element={<BreathingSession />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}



export default App;