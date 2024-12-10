import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useAuth } from '../../context/AuthContext';

const ConnectWallet = () => {
  const navigate = useNavigate();
  const { updateAuthState } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = `Sign this message to authenticate with Rever\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      const signature = await signer.signMessage(message);

      const response = await fetch('/api/auth/verify-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          signature,
          message
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to verify wallet');
      }

      updateAuthState(data.address, false);
      navigate('/create-profile');

    } catch (err) {
      setIsConnecting(false);
      throw err;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Connect Your Wallet</h2>
      
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
      >
        {isConnecting ? 'Connecting...' : 'Connect with MetaMask'}
      </button>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Download here</a>
      </p>
    </div>
  );
};

export default ConnectWallet;