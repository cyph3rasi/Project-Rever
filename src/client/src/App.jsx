import React from 'react';
import ConnectWallet from './components/auth/ConnectWallet';

// Single page app - just wallet connection
const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <ConnectWallet />
      </main>
    </div>
  );
};

export default App;