import React, { useState } from 'react';
import { ethers } from 'ethers';

const AVALANCHE_TESTNET_PARAMS = {
  chainId: '0xA869',
  chainName: 'Avalanche Testnet C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/']
};

const ConnectWallet = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(''); // For debugging

  const switchToAvalancheNetwork = async () => {
    try {
      setStatus('Switching to Avalanche network...');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_TESTNET_PARAMS.chainId }],
      });
      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          setStatus('Adding Avalanche network...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_TESTNET_PARAMS],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Avalanche network:', addError);
          throw new Error('Failed to add Avalanche network');
        }
      }
      throw switchError;
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError('');
      setStatus('Starting connection process...');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to continue');
      }

      // Switch to Avalanche network
      await switchToAvalancheNetwork();

      setStatus('Requesting account access...');
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const address = accounts[0];
      setStatus(`Account connected: ${address}`);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setStatus('Got signer, preparing message...');

      // Sign a message to verify ownership
      const message = `Sign this message to verify your wallet ownership\nTimestamp: ${Date.now()}`;
      setStatus('Requesting signature...');
      const signature = await signer.signMessage(message);
      setStatus('Message signed, verifying with backend...');

      // Verify signature with backend
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

      setStatus('Got response from backend, processing...');
      const data = await response.json();
      console.log('Backend response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to verify wallet');
      }

      setStatus('Connection successful!');
      if (onConnect) {
        onConnect(address);
      } else {
        console.error('onConnect callback is not defined');
      }

    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
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

      {status && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
          {status}
        </div>
      )}

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