import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

function App() {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const connectWallet = async () => {
    try {
      setError('');
      setStatus('Connecting wallet...');

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      const signer = await provider.getSigner();

      // Connect wallet to backend
      const response = await axios.post('/api/auth/connect-wallet', { address });
      const { messageToSign } = response.data;

      // Request signature
      const signature = await signer.signMessage(messageToSign);

      // Verify signature
      const verifyResponse = await axios.post('/api/auth/verify-signature', {
        address,
        signature,
        messageToSign
      });

      setWallet({ address, token: verifyResponse.data.token });
      setStatus('Wallet connected successfully!');
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      setStatus('');
    }
  };

  const disconnectWallet = async () => {
    try {
      await axios.post('/api/auth/logout');
      setWallet(null);
      setStatus('Wallet disconnected');
      setError('');
    } catch (err) {
      setError('Failed to disconnect wallet');
    }
  };

  return (
    <div className="container">
      <h1>Project Rever</h1>
      
      <div className="wallet-section">
        <h2>Wallet Connection</h2>
        
        {!wallet ? (
          <button className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="address">
              Connected Address: {wallet.address}
            </div>
            <button className="button" onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
          </>
        )}

        {status && (
          <div className="status success">{status}</div>
        )}

        {error && (
          <div className="status error">{error}</div>
        )}
      </div>
    </div>
  );
}

export default App;