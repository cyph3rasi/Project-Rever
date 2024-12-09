import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LucideArrowRight, Github } from 'lucide-react';

const LandingPage = () => {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setError('');
      setIsLoading(true);
      setStatus('Connecting wallet...');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      const signer = await provider.getSigner();

      const response = await fetch('/api/auth/connect-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      const data = await response.json();
      const { messageToSign } = data;

      const signature = await signer.signMessage(messageToSign);

      const verifyResponse = await fetch('/api/auth/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          signature,
          messageToSign
        })
      });
      const verifyData = await verifyResponse.json();

      setWallet({ address, token: verifyData.token });
      setStatus('Wallet connected successfully!');
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6" />
          <span className="text-xl font-bold">Project Rever</span>
        </div>
        <a
          href="https://github.com/cyph3rasi/Project-Rever"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <Github className="h-5 w-5" />
          <span>GitHub</span>
        </a>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Decentralized Social Network on Avalanche
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Own your content, earn tokens for engagement, and participate in
              platform governance. Welcome to the future of social networking.
            </p>
            {!wallet ? (
              <Button
                size="lg"
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? (
                  'Connecting...'
                ) : (
                  <>
                    Connect Wallet to Begin
                    <LucideArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Wallet Connected</CardTitle>
                  <CardDescription className="text-gray-400">
                    You're ready to start using Project Rever
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono text-gray-300">
                    {wallet.address}
                  </p>
                </CardContent>
              </Card>
            )}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              title="Token Rewards"
              description="Earn tokens for creating engaging content and participating in the community."
            />
            <FeatureCard
              title="NFT Integration"
              description="Mint your posts as NFTs and trade them in the marketplace."
            />
            <FeatureCard
              title="DAO Governance"
              description="Have a say in platform decisions through decentralized voting."
            />
            <FeatureCard
              title="Privacy First"
              description="Control your content visibility and interact privately."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <Card className="bg-gray-800/50 border-gray-700">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription className="text-gray-400">
        {description}
      </CardDescription>
    </CardHeader>
  </Card>
);

export default LandingPage;