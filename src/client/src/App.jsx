import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ConnectWallet from './components/auth/ConnectWallet';
import CreateProfile from './components/profile/CreateProfile';
import PrivateRoute from './components/auth/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/connect" element={<ConnectWallet />} />
              <Route
                path="/create-profile"
                element={
                  <PrivateRoute>
                    <CreateProfile />
                  </PrivateRoute>
                }
              />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

// Temporary Home component
const Home = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-center mb-8">
      Welcome to Project Rever
    </h1>
    <p className="text-center text-gray-600">
      Connect your wallet to get started
    </p>
  </div>
);

export default App;