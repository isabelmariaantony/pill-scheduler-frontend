// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import PillManager from './PillManager';
import Administration from './Administration';
import './App.css'; // Importing the CSS stylesheet

function App() {
    return (
        <Router>
            <div>
                <nav className="navbar">
                    <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Pill Manager
                    </NavLink>
                    <NavLink to="/admin" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Administration
                    </NavLink>
                </nav>
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<PillManager />} />
                        <Route path="/admin" element={<Administration />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
