import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';

function App() {
  // Simple auth check
  const isAuthenticated = !!localStorage.getItem('wallet_address');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={<LandingPage />} 
        />
        
        {/* Protected routes - redirect to landing if not authenticated */}
        <Route 
          path="/feed" 
          element={isAuthenticated ? <div>Feed Page (TODO)</div> : <Navigate to="/" />} 
        />
        
        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;