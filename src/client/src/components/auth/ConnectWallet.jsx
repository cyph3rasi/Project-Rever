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
      if (!window.ethereum) {
        window.alert('Please install MetaMask');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Sign the message
      const message = `Sign this message to authenticate with Rever\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      const signature = await signer.signMessage(message);

      // Show what we're sending to backend
      window.alert('Sending to backend:\n' + JSON.stringify({
        address,
        signature,
        message
      }, null, 2));

      // Send to backend
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

      // Show raw response
      const rawResponse = await response.text();
      window.alert('Raw backend response:\n' + rawResponse);

      // Parse response
      const data = JSON.parse(rawResponse);
      window.alert('Parsed response:\n' + JSON.stringify(data, null, 2));

      if (!data.success) {
        throw new Error(data.error || 'Failed to verify wallet');
      }

      // Update auth context
      window.alert('Updating auth state with:\nhasProfile: ' + data.hasProfile);
      updateAuthState(data.address, data.hasProfile);

      // Navigate
      const destination = data.hasProfile ? '/feed' : '/create-profile';
      window.alert('About to navigate to: ' + destination);
      navigate(destination);

    } catch (err) {
      window.alert('Error: ' + err.message);
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