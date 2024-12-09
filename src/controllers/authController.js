const ethers = require('ethers');

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
    req.session.walletAddress = address;

    res.json({ 
      success: true, 
      address 
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      error: 'Authentication failed' 
    });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.json({ success: true });
};

module.exports = {
  verifySignature,
  logout
};