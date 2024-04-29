// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PillManager from './PillManager';
import Administration from './Administration';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <Link to="/">Pill Manager</Link> | <Link to="/admin">Administration</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<PillManager />} />
                    <Route path="/admin" element={<Administration />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
