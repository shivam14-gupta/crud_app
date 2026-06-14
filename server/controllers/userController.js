const User = require('../models/User');
const { logActivity } = require('../utils/helpers');

exports.getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    await logActivity(user._id, 'UPDATE_PROFILE', 'Profile updated');

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    await logActivity(user._id, 'CHANGE_PASSWORD', 'Password changed');

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
