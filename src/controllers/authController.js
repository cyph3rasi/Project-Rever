const ethers = require('ethers');
const supabase = require('../config/supabase');

const verifySignature = async (req, res) => {
  try {
    const { address, signature, message } = req.body;
    console.log('Verifying signature for:', address);

    if (!address || !signature || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Verify the signature matches the address
    const signerAddress = ethers.verifyMessage(message, signature);
    console.log('Recovered signer address:', signerAddress);
    
    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ 
        error: 'Invalid signature' 
      });
    }

    // Create a session
    req.session.walletAddress = address.toLowerCase();
    console.log('Created session for wallet:', req.session.walletAddress);

    // Check if user has a profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single();

    console.log('Profile check result:', { profile, error });

    const hasProfile = !!profile;
    console.log('Profile status:', { hasProfile });

    res.json({ 
      success: true, 
      address: address.toLowerCase(),
      hasProfile
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
};

const checkAuth = async (req, res) => {
  try {
    console.log('Checking auth for session:', req.session);

    if (!req.session.walletAddress) {
      console.log('No wallet address in session');
      return res.json({ 
        success: false 
      });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', req.session.walletAddress)
      .single();

    console.log('Profile check result:', { profile, error });

    const hasProfile = !!profile;
    console.log('Profile status:', { hasProfile });

    res.json({
      success: true,
      address: req.session.walletAddress,
      hasProfile
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ 
      error: 'Failed to check authentication',
      details: error.message 
    });
  }
};

const logout = (req, res) => {
  console.log('Logging out session:', req.session);
  req.session.destroy();
  res.json({ success: true });
};

module.exports = {
  verifySignature,
  checkAuth,
  logout
};