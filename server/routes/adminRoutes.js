const express = require('express');
const router = express.Router();
const {
  getDashboard, getUsers, createUser, updateUser, deleteUser, getReports,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), getDashboard);
router.get('/users', protect, authorize('admin'), getUsers);
router.post('/users', protect, authorize('admin'), createUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/reports', protect, authorize('admin'), getReports);

module.exports = router;
