const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// User routes
router.get('/profile/:address', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/:address/posts', userController.getUserPosts);

module.exports = router;