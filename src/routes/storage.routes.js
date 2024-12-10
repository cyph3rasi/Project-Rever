const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, uploadJSON, getContent, unpinContent } = require('../controllers/storage.controller');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Test route without auth
router.post('/test-upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Test upload received:', req.file);
    const result = await uploadFile(req, res);
    console.log('Upload result:', result);
    return result;
  } catch (error) {
    console.error('Test upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Regular routes with auth
router.post('/upload', auth, upload.single('file'), uploadFile);
router.post('/upload-json', auth, uploadJSON);
router.get('/:cid', auth, getContent);
router.delete('/:cid', auth, unpinContent);

module.exports = router;
