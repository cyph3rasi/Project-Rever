const multer = require('multer');
const { File } = require('web3.storage');
const { uploadToIPFS } = require('../config/ipfs');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 4 // Maximum 4 files per request
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// Middleware to handle file uploads to IPFS
const handleIPFSUpload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    // Convert multer files to web3.storage Files
    const files = req.files.map(file => {
      return new File(
        [file.buffer],
        file.originalname,
        { type: file.mimetype }
      );
    });

    // Upload each file to IPFS
    const ipfsResults = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToIPFS(file);
        return {
          originalName: file.name,
          type: file.type,
          ...result
        };
      })
    );

    // Attach IPFS results to request object
    req.ipfsFiles = ipfsResults;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  handleIPFSUpload
};