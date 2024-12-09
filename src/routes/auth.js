const express = require('express');
const router = express.Router();
const { verifySignature, logout } = require('../controllers/authController');

// Verify wallet signature and create session
router.post('/verify-signature', verifySignature);

// Logout and destroy session
router.post('/logout', logout);

module.exports = router;