import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, requireProfile = true }) => {
  const { walletAddress, hasProfile, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute state:', { walletAddress, hasProfile, loading, requireProfile });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!walletAddress) {
    console.log('No wallet, redirecting to connect');
    return <Navigate to="/connect" state={{ from: location }} replace />;
  }

  if (requireProfile && !hasProfile) {
    console.log('No profile, redirecting to create profile');
    return <Navigate to="/create-profile" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;