const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const postRoutes = require('./post.routes');
const userRoutes = require('./user.routes');

// Route middleware
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);

module.exports = router;