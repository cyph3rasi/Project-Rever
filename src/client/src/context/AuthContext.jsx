import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  const updateAuthState = (address) => {
    setWalletAddress(address);
  };

  const logout = async () => {
    setWalletAddress(null);
  };

  return (
    <AuthContext.Provider value={{ 
      walletAddress,
      updateAuthState,
      logout 
    }}>
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