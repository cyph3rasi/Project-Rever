const ethers = require('ethers');
const supabase = require('../config/supabase');

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
    console.log('Session created for wallet:', req.session.walletAddress);

    // Check if user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select()
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (profileError) {
      console.error('Supabase profile query error:', profileError);
      // If the error is because the table doesn't exist, we'll see it here
    }

    console.log('Profile query result:', { profile, profileError });

    res.json({ 
      success: true, 
      address: address.toLowerCase(),
      hasProfile: !!profile
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
    if (!req.session.walletAddress) {
      return res.json({ 
        success: false 
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select()
      .eq('wallet_address', req.session.walletAddress)
      .single();

    if (profileError) {
      console.error('Supabase profile check error:', profileError);
    }

    console.log('Auth check result:', { 
      walletAddress: req.session.walletAddress,
      hasProfile: !!profile,
      profile,
      profileError
    });

    res.json({
      success: true,
      address: req.session.walletAddress,
      hasProfile: !!profile
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
  req.session.destroy();
  res.json({ success: true });
};

module.exports = {
  verifySignature,
  checkAuth,
  logout
};