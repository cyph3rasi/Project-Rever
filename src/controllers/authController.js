const ethers = require('ethers');
const supabase = require('../config/supabase');

const verifySignature = async (req, res) => {
  try {
    console.log('DEBUG: Signature verification started', req.body);
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
    const { data: profile, error } = await supabase
      .from('profiles')
      .select()
      .eq('wallet_address', address.toLowerCase())
      .single();

    console.log('DEBUG: Profile check result', { profile, error });

    // Send response
    res.json({ 
      success: true, 
      address: address.toLowerCase(),
      hasProfile: !!profile,
      // Adding debug info
      debug: {
        profile,
        error,
        sessionWallet: req.session.walletAddress
      }
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

    const { data: profile } = await supabase
      .from('profiles')
      .select()
      .eq('wallet_address', req.session.walletAddress)
      .single();

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