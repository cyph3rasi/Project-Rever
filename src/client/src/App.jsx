import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ConnectWallet from './components/auth/ConnectWallet';
import CreateProfile from './components/profile/CreateProfile';

// Feed component (temporary)
const Feed = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-center mb-8">
      Feed Page (To Do)
    </h1>
  </div>
);

// Auth-aware router component
const AuthRouter = () => {
  const { walletAddress, hasProfile, loading } = useAuth();
  const navigate = useNavigate();

  // Handle navigation based on auth state
  useEffect(() => {
    console.log('Auth state changed:', { walletAddress, hasProfile, loading });
    
    if (!loading) {
      if (!walletAddress) {
        console.log('No wallet, navigating to /');
        navigate('/');
      } else if (!hasProfile) {
        console.log('No profile, navigating to /create-profile');
        navigate('/create-profile');
      }
    }
  }, [walletAddress, hasProfile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        !walletAddress ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center mb-8">
              Welcome to Project Rever
            </h1>
            <ConnectWallet />
          </div>
        ) : (
          <Navigate to={hasProfile ? '/feed' : '/create-profile'} replace />
        )
      } />
      
      <Route 
        path="/create-profile" 
        element={
          !walletAddress ? (
            <Navigate to="/" replace />
          ) : hasProfile ? (
            <Navigate to="/feed" replace />
          ) : (
            <CreateProfile />
          )
        } 
      />
      
      <Route 
        path="/feed" 
        element={
          !walletAddress ? (
            <Navigate to="/" replace />
          ) : !hasProfile ? (
            <Navigate to="/create-profile" replace />
          ) : (
            <Feed />
          )
        } 
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="py-8">
            <AuthRouter />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;