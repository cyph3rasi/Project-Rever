const ethers = require('ethers');
const Profile = require('../models/Profile');

const verifySignature = async (req, res) => {
  try {
    const { address, signature, message } = req.body;

    if (!address || !signature || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Verify the signature matches the address
    const signerAddress = ethers.verifyMessage(message, signature);
    
    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ 
        error: 'Invalid signature' 
      });
    }

    // Create a session
    req.session.walletAddress = address.toLowerCase();

    // Check if user has a profile
    const profile = await Profile.findOne({ walletAddress: address.toLowerCase() });

    res.json({ 
      success: true, 
      address: address.toLowerCase(),
      hasProfile: !!profile
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      error: 'Authentication failed' 
    });
  }
};

const checkAuth = async (req, res) => {
  try {
    if (!req.session.walletAddress) {
      return res.json({ 
        success: false 
      });
    }

    const profile = await Profile.findOne({ 
      walletAddress: req.session.walletAddress 
    });

    res.json({
      success: true,
      address: req.session.walletAddress,
      hasProfile: !!profile
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ 
      error: 'Failed to check authentication' 
    });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.json({ success: true });
};

module.exports = {
  verifySignature,
  checkAuth,
  logout
};