const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/update-password', verifyToken, authController.updatePassword);
router.get('/me', verifyToken, authController.me);

module.exports = router;
