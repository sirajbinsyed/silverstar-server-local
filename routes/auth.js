const express = require('express');
const { login, getMe, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/me
router.get('/me', auth, getMe);

// @route   PUT /api/auth/change-password
router.put('/change-password', auth, changePassword);

module.exports = router;