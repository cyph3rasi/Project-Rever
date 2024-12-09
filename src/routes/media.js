const express = require('express');
const router = express.Router();
const { upload, handleIPFSUpload } = require('../middleware/ipfsMiddleware');
const authMiddleware = require('../middleware/auth');

// Upload media files to IPFS
router.post('/upload',
  authMiddleware,
  upload.array('files', 4),
  handleIPFSUpload,
  async (req, res) => {
    try {
      if (!req.ipfsFiles) {
        return res.status(400).json({
          error: 'No files were uploaded'
        });
      }

      res.json({
        success: true,
        files: req.ipfsFiles
      });
    } catch (error) {
      console.error('Media upload error:', error);
      res.status(500).json({
        error: 'Failed to process media upload'
      });
    }
  }
);

module.exports = router;