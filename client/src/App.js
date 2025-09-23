import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import BreatheScreen from './screens/BreatheScreen';
import BreathingSession from './screens/BreathingSession';
import Layout from './components/Layout';
import PerspectiveShiftScreen from './screens/PerspectiveShiftScreen';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Ścieżki z panelem sterowania są wewnątrz Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/breathe" element={<BreatheScreen />} />
            <Route path="/perspective" element={<PerspectiveShiftScreen />} />
            {/* Tutaj dodaj inne ekrany, które mają mieć panel */}
          </Route>
          
          {/* Ścieżka sesji oddechowej jest renderowana osobno */}
          <Route path="/breathe/session" element={<BreathingSession />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;