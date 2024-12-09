import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Shield, Share2, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent } from './ui/card';

const LandingPage = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to continue');
      return;
    }
    
    setIsConnecting(true);
    setError('');
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const address = accounts[0];
      
      // Get signature for authentication
      const message = `Sign this message to authenticate with Rever\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });
      
      // Send to backend
      const response = await fetch('/api/auth/verify-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address, signature, message })
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      // Store address in localStorage for client-side auth checks
      localStorage.setItem('wallet_address', address);
      
      // Redirect to feed on success
      navigate('/feed');
      
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const features = [
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Decentralized Content",
      description: "Own your content with blockchain-powered posts and media"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Governed",
      description: "Participate in platform decisions through DAO governance"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy Focused",
      description: "Control your content visibility with advanced privacy features"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Rever
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            A decentralized social network where you own your content, earn rewards, 
            and participate in governance
          </p>
          
          <div className="space-y-4">
            <Button 
              size="lg"
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Wallet className="mr-2 h-5 w-5" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet to Start'}
            </Button>

            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Rever?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="rounded-full bg-blue-600 p-3 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-blue-500">100%</div>
            <div className="mt-2 text-gray-400">Content Ownership</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500">0%</div>
            <div className="mt-2 text-gray-400">Platform Fees</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500">24/7</div>
            <div className="mt-2 text-gray-400">Censorship Resistant</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;