const express = require('express');
const router = express.Router();
const {
  getRecords, getRecord, createRecord, updateRecord, deleteRecord,
} = require('../controllers/recordController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRecords);
router.get('/:id', protect, getRecord);
router.post('/', protect, createRecord);
router.put('/:id', protect, updateRecord);
router.delete('/:id', protect, deleteRecord);

module.exports = router;
