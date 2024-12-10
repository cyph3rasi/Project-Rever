import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ConnectWallet from './components/auth/ConnectWallet';
import CreateProfile from './components/profile/CreateProfile';
import PrivateRoute from './components/auth/PrivateRoute';
import { useAuth } from './context/AuthContext';

// Feed component (temporary)
const Feed = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-center mb-8">
      Feed Page (To Do)
    </h1>
  </div>
);

// Profile check wrapper
const ProfileCheckRoute = ({ element: Element }) => {
  const { walletAddress, hasProfile, loading } = useAuth();
  const location = useLocation();

  console.log('ProfileCheckRoute state:', {
    walletAddress,
    hasProfile,
    loading,
    currentPath: location.pathname
  });

  if (loading) {
    console.log('Still loading auth state...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!walletAddress) {
    console.log('No wallet address, redirecting to connect');
    return <Navigate to="/connect" replace state={{ from: location }} />;
  }

  if (walletAddress && !hasProfile) {
    console.log('Has wallet but no profile, redirecting to profile creation');
    return <Navigate to="/create-profile" replace state={{ from: location }} />;
  }

  console.log('All checks passed, rendering protected content');
  return <Element />;
};

// Home component with auth-aware rendering
const Home = () => {
  const { walletAddress, hasProfile } = useAuth();
  const location = useLocation();

  console.log('Home component state:', {
    walletAddress,
    hasProfile,
    currentPath: location.pathname
  });

  if (walletAddress) {
    if (hasProfile) {
      console.log('User has wallet and profile, redirecting to feed');
      return <Navigate to="/feed" replace />;
    } else {
      console.log('User has wallet but no profile, redirecting to profile creation');
      return <Navigate to="/create-profile" replace />;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Project Rever
      </h1>
      <p className="text-center text-gray-600">
        Connect your wallet to get started
      </p>
    </div>
  );
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
              <Route path="/connect" element={<ConnectWallet />} />
              <Route
                path="/create-profile"
                element={
                  <PrivateRoute>
                    <CreateProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/feed"
                element={<ProfileCheckRoute element={Feed} />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;