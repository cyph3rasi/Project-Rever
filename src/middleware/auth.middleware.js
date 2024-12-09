const { ethers } = require('ethers');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        error: 'No authorization header' 
      });
    }

    // For now, we're just checking if the address is valid
    // In production, you would verify a JWT token here
    const address = authHeader.split(' ')[1];
    
    if (!address || !ethers.isAddress(address)) {
      return res.status(401).json({ 
        error: 'Invalid authentication token' 
      });
    }

    // Add the wallet address to the request object
    req.walletAddress = address;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      error: 'Authentication failed' 
    });
  }
};

module.exports = {
  requireAuth
};