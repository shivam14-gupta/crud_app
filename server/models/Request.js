const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Record',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [500, 'Feedback cannot exceed 500 characters'],
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Request', requestSchema);
