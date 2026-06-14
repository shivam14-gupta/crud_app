const User = require('../models/User');
const Record = require('../models/Record');
const Request = require('../models/Request');
const ActivityLog = require('../models/ActivityLog');
const { logActivity } = require('../utils/helpers');

exports.getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecords = await Record.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const approvedRequests = await Request.countDocuments({ status: 'approved' });
    const rejectedRequests = await Request.countDocuments({ status: 'rejected' });

    res.json({
      totalUsers,
      totalRecords,
      activeUsers,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({ name, email, password, role: role || 'user' });

    await logActivity(req.user._id, 'CREATE_USER', `Created user: ${user.name}`);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, role, status } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    await logActivity(req.user._id, 'UPDATE_USER', `Updated user: ${user.name}`);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    await logActivity(req.user._id, 'DELETE_USER', `Deleted user: ${user.name}`);

    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecords = await Record.countDocuments();
    const totalRequests = await Request.countDocuments();

    const recordsByStatus = await Record.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const requestsByStatus = await Request.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const recentActivities = await ActivityLog.find()
      .populate('userId', 'name email')
      .sort('-createdAt')
      .limit(20);

    res.json({
      totals: { totalUsers, totalRecords, totalRequests },
      recordsByStatus,
      requestsByStatus,
      usersByRole,
      recentActivities,
    });
  } catch (error) {
    next(error);
  }
};
