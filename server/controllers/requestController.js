const Request = require('../models/Request');
const Notification = require('../models/Notification');
const { logActivity } = require('../utils/helpers');

exports.getRequests = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.userId = req.user._id;
    }

    const requests = await Request.find(query)
      .populate('userId', 'name email')
      .populate('recordId', 'title description')
      .sort('-createdAt');

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

exports.createRequest = async (req, res, next) => {
  try {
    const { recordId } = req.body;

    const existing = await Request.findOne({ userId: req.user._id, recordId });
    if (existing) {
      return res.status(400).json({ message: 'Request already exists for this record' });
    }

    const request = await Request.create({
      userId: req.user._id,
      recordId,
    });

    await logActivity(req.user._id, 'CREATE_REQUEST', 'Submitted a new request');

    const populated = await request.populate(['userId', 'recordId']);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.updateRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (req.user.role === 'admin') {
      const { status, feedback } = req.body;
      if (status) request.status = status;
      if (feedback !== undefined) request.feedback = feedback;

      await request.save();

      await Notification.create({
        userId: request.userId,
        title: `Request ${status}`,
        message: `Your request has been ${status}. ${feedback ? 'Feedback: ' + feedback : ''}`,
      });

      await logActivity(req.user._id, 'UPDATE_REQUEST', `Updated request status to ${status}`);
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const populated = await request.populate(['userId', 'recordId']);
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (req.user.role === 'user' && request.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await logActivity(req.user._id, 'DELETE_REQUEST', 'Deleted a request');

    await request.deleteOne();

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    next(error);
  }
};
