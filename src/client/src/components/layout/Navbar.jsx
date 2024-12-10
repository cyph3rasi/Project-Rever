import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { walletAddress, logout } = useAuth();

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Project Rever</span>
            </Link>
          </div>

          <div className="flex items-center">
            {walletAddress ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={`/profile/${walletAddress}`}
                  className="text-gray-700 hover:text-gray-900"
                >
                  {shortenAddress(walletAddress)}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <Link
                to="/connect"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Connect Wallet
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;