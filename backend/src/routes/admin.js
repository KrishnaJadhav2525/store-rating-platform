const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.post('/users', adminController.createUser);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetails);
router.post('/stores', adminController.createStore);
router.get('/stores', adminController.listStores);

module.exports = router;
