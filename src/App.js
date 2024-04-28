import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PillManager from './PillManager';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<PillManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
