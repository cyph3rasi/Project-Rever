import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ConnectWallet from './components/auth/ConnectWallet';
import CreateProfile from './components/profile/CreateProfile';

// Simplified to just two pages
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <main className="py-8">
            <Routes>
              <Route path="/" element={<ConnectWallet />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="*" element={<ConnectWallet />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;