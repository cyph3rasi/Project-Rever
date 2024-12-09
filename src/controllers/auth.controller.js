const { ethers } = require('ethers');

// Message to be signed by the user's wallet
const SIGN_MESSAGE = 'Welcome to Project Rever! Please sign this message to verify your wallet ownership.';

const connectWallet = async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ 
        error: 'Wallet address is required' 
      });
    }

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ 
        error: 'Invalid wallet address' 
      });
    }

    // Generate a nonce for this session
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const messageToSign = `${SIGN_MESSAGE}\nNonce: ${nonce}`;

    // In a production environment, you'd want to store this nonce in a database
    // associated with the address and with an expiration time

    res.status(200).json({
      message: 'Wallet connected successfully',
      address,
      messageToSign
    });
  } catch (error) {
    console.error('Wallet connection error:', error);
    res.status(500).json({ 
      error: 'Failed to connect wallet' 
    });
  }
};

const verifySignature = async (req, res) => {
  try {
    const { address, signature, messageToSign } = req.body;

    if (!address || !signature || !messageToSign) {
      return res.status(400).json({ 
        error: 'Address, signature, and message are required' 
      });
    }

    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(messageToSign, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ 
        error: 'Invalid signature' 
      });
    }

    // In a production environment, you'd want to:
    // 1. Verify the nonce matches what was stored
    // 2. Generate a JWT token
    // 3. Store the session

    res.status(200).json({
      message: 'Signature verified successfully',
      address,
      // You would typically generate and return a JWT token here
      token: 'mock-jwt-token'
    });
  } catch (error) {
    console.error('Signature verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify signature' 
    });
  }
};

const logout = async (req, res) => {
  try {
    // In a production environment, you would:
    // 1. Invalidate the JWT token
    // 2. Clear the session
    res.status(200).json({ 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Failed to logout' 
    });
  }
};

module.exports = {
  connectWallet,
  verifySignature,
  logout
};