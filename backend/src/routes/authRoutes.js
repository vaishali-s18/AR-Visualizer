const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/signup — create a new account
router.post('/signup', signup);

// POST /api/auth/login — returns a JWT token on success
router.post('/login', login);

// GET /api/auth/me — returns the currently logged-in user (requires valid JWT)
router.get('/me', protect, getMe);

module.exports = router;
