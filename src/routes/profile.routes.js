const express = require('express');
const router = express.Router();
const multer = require('multer');
const { upsertProfile, getProfile, checkUsername } = require('../controllers/profileController');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Profile routes
router.post('/', 
  auth, 
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]), 
  upsertProfile
);

router.get('/:address', getProfile);
router.get('/username/:username', checkUsername);

module.exports = router;