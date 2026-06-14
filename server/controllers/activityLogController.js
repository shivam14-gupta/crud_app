const ActivityLog = require('../models/ActivityLog');

exports.getActivityLogs = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.userId = req.user._id;
    }

    const logs = await ActivityLog.find(query)
      .populate('userId', 'name email')
      .sort('-createdAt')
      .limit(50);

    res.json(logs);
  } catch (error) {
    next(error);
  }
};
