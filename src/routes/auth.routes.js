const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Authentication routes
router.post('/connect-wallet', authController.connectWallet);
router.post('/verify-signature', authController.verifySignature);
router.post('/logout', authController.logout);

module.exports = router;