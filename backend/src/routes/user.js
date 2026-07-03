const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole('NORMAL_USER'));

router.get('/stores', userController.listStores);
router.post('/stores/:storeId/rating', userController.submitRating);

module.exports = router;
