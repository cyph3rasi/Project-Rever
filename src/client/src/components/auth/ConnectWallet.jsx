import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useAuth } from '../../context/AuthContext';

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

const ConnectWallet = () => {
  const navigate = useNavigate();
  const { updateAuthState } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  // Force an error to show in the UI for debugging
  useEffect(() => {
    alert('ConnectWallet component mounted');
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      alert('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo);
      return false;
    };
  }, []);

  const connectWallet = async () => {
    try {
      alert('Starting wallet connection...');
      setIsConnecting(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to continue');
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const address = accounts[0];
      alert('Got address: ' + address);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const message = `Sign this message to verify your wallet ownership\nTimestamp: ${Date.now()}`;
      const signature = await signer.signMessage(message);

      alert('About to verify signature with backend');
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
      alert('Backend response: ' + JSON.stringify(data));

      if (!data.success) {
        throw new Error(data.error || 'Failed to verify wallet');
      }

      // Force error if hasProfile is undefined
      if (typeof data.hasProfile === 'undefined') {
        throw new Error('hasProfile is undefined in response');
      }

      // Update auth context state
      updateAuthState(data.address, data.hasProfile);
      
      alert('About to navigate. hasProfile: ' + data.hasProfile);
      
      // Navigate based on profile status
      if (data.hasProfile) {
        navigate('/feed');
      } else {
        navigate('/create-profile');
      }

    } catch (err) {
      alert('Error: ' + err.message);
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