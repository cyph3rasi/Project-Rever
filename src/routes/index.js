const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const storageRoutes = require('./storage.routes');

// Use route modules
router.use('/auth', authRoutes);
router.use('/storage', storageRoutes);

module.exports = router;
