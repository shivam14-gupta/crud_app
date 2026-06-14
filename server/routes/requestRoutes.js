const express = require('express');
const router = express.Router();
const {
  getRequests, createRequest, updateRequest, deleteRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRequests);
router.post('/', protect, createRequest);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
