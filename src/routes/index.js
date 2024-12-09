const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const postRoutes = require('./post.routes');
const userRoutes = require('./user.routes');

// Basic test endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Project Rever API',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      users: '/api/users'
    }
  });
});

// Route middleware
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);

module.exports = router;