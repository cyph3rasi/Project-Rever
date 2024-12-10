import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    console.log('Checking auth state...');
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      console.log('Auth check response:', data);
      
      if (data.success && data.address) {
        setWalletAddress(data.address);
        setHasProfile(data.hasProfile);
        console.log('Setting auth state:', {
          address: data.address,
          hasProfile: data.hasProfile
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already authenticated
  useEffect(() => {
    checkAuth();
  }, []);

  const updateAuthState = (address, profileExists) => {
    console.log('Updating auth state:', { address, profileExists });
    setWalletAddress(address);
    setHasProfile(profileExists);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setWalletAddress(null);
      setHasProfile(false);
      console.log('Logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    walletAddress,
    hasProfile,
    loading,
    updateAuthState,
    logout
  };

  console.log('Current auth context:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};