import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnectWallet from './components/auth/ConnectWallet';
import CreateProfile from './components/profile/CreateProfile';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main className="py-8">
          <Routes>
            <Route path="/" element={<ConnectWallet />} />
            <Route path="/create-profile" element={<CreateProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;