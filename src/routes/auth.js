const express = require('express');
const router = express.Router();
const { verifySignature, checkAuth, logout } = require('../controllers/authController');

router.post('/verify-signature', verifySignature);
router.get('/check', checkAuth);
router.post('/logout', logout);

module.exports = router;