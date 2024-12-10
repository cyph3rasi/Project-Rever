const Profile = require('../models/Profile');
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

    // Find existing profile or create new one
    let profile = await Profile.findOne({ walletAddress });

    if (profile) {
      // Update existing profile
      profile.username = username;
      profile.bio = bio || profile.bio;
      profile.socialLinks = socialLinks || profile.socialLinks;
      if (avatarIPFSHash) profile.avatarIPFSHash = avatarIPFSHash;
      if (coverIPFSHash) profile.coverIPFSHash = coverIPFSHash;

      await profile.save();
    } else {
      // Create new profile
      profile = await Profile.create({
        walletAddress,
        username,
        bio,
        socialLinks,
        avatarIPFSHash,
        coverIPFSHash
      });
    }

    res.json({
      success: true,
      profile: {
        walletAddress: profile.walletAddress,
        username: profile.username,
        bio: profile.bio,
        socialLinks: profile.socialLinks,
        avatarUrl: avatarIPFSHash ? `https://gateway.pinata.cloud/ipfs/${avatarIPFSHash}` : null,
        coverUrl: coverIPFSHash ? `https://gateway.pinata.cloud/ipfs/${coverIPFSHash}` : null,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
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
    
    const profile = await Profile.findOne({ 
      walletAddress: address.toLowerCase() 
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      success: true,
      profile: {
        walletAddress: profile.walletAddress,
        username: profile.username,
        bio: profile.bio,
        socialLinks: profile.socialLinks,
        avatarUrl: profile.avatarIPFSHash ? `https://gateway.pinata.cloud/ipfs/${profile.avatarIPFSHash}` : null,
        coverUrl: profile.coverIPFSHash ? `https://gateway.pinata.cloud/ipfs/${profile.coverIPFSHash}` : null,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
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
    
    const exists = await Profile.findOne({ username });
    
    res.json({
      success: true,
      available: !exists
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