const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect, orgAdminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, orgAdminOnly, getMe);

module.exports = router;
