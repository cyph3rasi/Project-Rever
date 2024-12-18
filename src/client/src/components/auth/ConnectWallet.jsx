import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

const ConnectWallet = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError('');
      window.alert('1. Starting connection...');
      
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      window.alert('2. Requesting accounts...');
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const address = accounts[0];
      window.alert('3. Got address: ' + address);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = `Sign this message to authenticate with Rever\nAddress: ${address}\nTimestamp: ${Date.now()}`;

      window.alert('4. Requesting signature...');
      const signature = await signer.signMessage(message);

      window.alert('5. Sending to backend...');
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

      window.alert('6. Got backend response...');
      const data = await response.json();
      window.alert('7. Response data: ' + JSON.stringify(data));

      if (!data.success) {
        throw new Error(data.error || 'Failed to verify wallet');
      }

      window.alert('8. About to navigate...');
      navigate('/create-profile');
      window.alert('9. Navigation complete!');

    } catch (err) {
      window.alert('Error: ' + err.message);
      setError(err.message);
    } finally {
      setIsConnecting(false);
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

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <p className="mt-4 text-sm text-gray-600 text-center">
        Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Download here</a>
      </p>
    </div>
  );
};

export default ConnectWallet;