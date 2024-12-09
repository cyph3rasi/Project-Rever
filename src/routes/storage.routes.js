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

// File upload routes
router.post('/upload', auth, upload.single('file'), uploadFile);
router.post('/upload-json', auth, uploadJSON);

// Content management routes
router.get('/:cid', auth, getContent);
router.delete('/:cid', auth, unpinContent);

module.exports = router;
