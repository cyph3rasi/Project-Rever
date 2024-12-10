import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ConnectWallet from './components/auth/ConnectWallet';
import CreateProfile from './components/profile/CreateProfile';

// Guard for routes that require a profile
const RequireProfile = ({ children }) => {
  const { walletAddress, hasProfile, loading } = useAuth();
  
  if (!walletAddress || !hasProfile) {
    return <Navigate to="/create-profile" replace />;
  }
  
  return children;
};

// Guard for the profile creation route
const ProfileCreationGuard = ({ children }) => {
  const { walletAddress, hasProfile } = useAuth();

  // If no wallet, redirect to connect
  if (!walletAddress) {
    return <Navigate to="/" replace />;
  }

  // If has profile, redirect to feed
  if (hasProfile) {
    return <Navigate to="/feed" replace />;
  }

  return children;
};

// Feed component (temporary)
const Feed = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-center mb-8">
      Feed Page (To Do)
    </h1>
  </div>
);

// Home component with auth-aware rendering
const Home = () => {
  const { walletAddress, hasProfile } = useAuth();

  if (walletAddress) {
    if (hasProfile) {
      return <Navigate to="/feed" replace />;
    } else {
      return <Navigate to="/create-profile" replace />;
    }
  }

  return <ConnectWallet />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/create-profile" 
                element={
                  <ProfileCreationGuard>
                    <CreateProfile />
                  </ProfileCreationGuard>
                } 
              />
              <Route 
                path="/feed" 
                element={
                  <RequireProfile>
                    <Feed />
                  </RequireProfile>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;