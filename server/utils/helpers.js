const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, description) => {
  try {
    await ActivityLog.create({ userId, action, description });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

const generateToken = (user) => {
  return {
    accessToken: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    }),
    refreshToken: jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    }),
  };
};

const jwt = require('jsonwebtoken');

module.exports = { logActivity, generateToken };
