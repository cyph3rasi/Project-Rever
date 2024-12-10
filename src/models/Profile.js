const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatarIPFSHash: {
    type: String,
    default: ''
  },
  coverIPFSHash: {
    type: String,
    default: ''
  },
  socialLinks: {
    twitter: String,
    github: String,
    website: String
  },
  nonce: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a random nonce for wallet signature verification
profileSchema.pre('save', function(next) {
  if (!this.nonce) {
    this.nonce = Math.floor(Math.random() * 1000000).toString();
  }
  next();
});

module.exports = mongoose.model('Profile', profileSchema);