const supabase = require('../config/supabase');
const { uploadToIPFS } = require('../config/ipfs');

// Create or update profile
const upsertProfile = async (req, res) => {
  try {
    const { username, bio, socialLinks } = req.body;
    const walletAddress = req.session.walletAddress;

    if (!walletAddress) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Handle avatar upload if provided
    let avatarIPFSHash = '';
    if (req.files && req.files.avatar) {
      const result = await uploadToIPFS(req.files.avatar[0]);
      avatarIPFSHash = result.cid;
    }

    // Handle cover image upload if provided
    let coverIPFSHash = '';
    if (req.files && req.files.cover) {
      const result = await uploadToIPFS(req.files.cover[0]);
      coverIPFSHash = result.cid;
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select()
      .eq('wallet_address', walletAddress)
      .single();

    // Prepare profile data
    const profileData = {
      wallet_address: walletAddress,
      username,
      bio: bio || '',
      social_links: socialLinks,
      updated_at: new Date().toISOString()
    };

    if (avatarIPFSHash) profileData.avatar_ipfs_hash = avatarIPFSHash;
    if (coverIPFSHash) profileData.cover_ipfs_hash = coverIPFSHash;

    let profile;
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('wallet_address', walletAddress)
        .select()
        .single();

      if (error) throw error;
      profile = data;
    } else {
      // Create new profile
      profileData.created_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) throw error;
      profile = data;
    }

    res.json({
      success: true,
      profile: {
        walletAddress: profile.wallet_address,
        username: profile.username,
        bio: profile.bio,
        socialLinks: profile.social_links,
        avatarUrl: profile.avatar_ipfs_hash ? `https://gateway.pinata.cloud/ipfs/${profile.avatar_ipfs_hash}` : null,
        coverUrl: profile.cover_ipfs_hash ? `https://gateway.pinata.cloud/ipfs/${profile.cover_ipfs_hash}` : null,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      details: error.message 
    });
  }
};

// Get profile by wallet address
const getProfile = async (req, res) => {
  try {
    const { address } = req.params;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select()
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (error) throw error;

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      success: true,
      profile: {
        walletAddress: profile.wallet_address,
        username: profile.username,
        bio: profile.bio,
        socialLinks: profile.social_links,
        avatarUrl: profile.avatar_ipfs_hash ? `https://gateway.pinata.cloud/ipfs/${profile.avatar_ipfs_hash}` : null,
        coverUrl: profile.cover_ipfs_hash ? `https://gateway.pinata.cloud/ipfs/${profile.cover_ipfs_hash}` : null,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// Check if username is available
const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows" error
      throw error;
    }
    
    res.json({
      success: true,
      available: !data
    });
  } catch (error) {
    console.error('Username check error:', error);
    res.status(500).json({ error: 'Failed to check username' });
  }
};

module.exports = {
  upsertProfile,
  getProfile,
  checkUsername
};