import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ProfileForm from './components/ProfileForm';
import ResumeViewer from './components/ResumeViewer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background dark">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/resume/:id" element={<ResumeViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


