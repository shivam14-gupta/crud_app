const Record = require('../models/Record');
const ActivityLog = require('../models/ActivityLog');
const { logActivity } = require('../utils/helpers');

exports.getRecords = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.createdBy = req.user._id;
    }

    const records = await Record.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort('-createdAt');

    res.json(records);
  } catch (error) {
    next(error);
  }
};

exports.getRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (req.user.role === 'user' && record.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(record);
  } catch (error) {
    next(error);
  }
};

exports.createRecord = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const record = await Record.create({
      title,
      description,
      createdBy: req.user._id,
    });

    await logActivity(req.user._id, 'CREATE_RECORD', `Created record: ${title}`);

    const populated = await record.populate('createdBy', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.updateRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (req.user.role === 'user' && record.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, status, assignedTo } = req.body;
    if (title) record.title = title;
    if (description !== undefined) record.description = description;
    if (status && req.user.role === 'admin') record.status = status;
    if (assignedTo && req.user.role === 'admin') record.assignedTo = assignedTo;

    await record.save();

    await logActivity(req.user._id, 'UPDATE_RECORD', `Updated record: ${record.title}`);

    const populated = await record.populate(['createdBy', 'assignedTo']);

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (req.user.role === 'user' && record.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await logActivity(req.user._id, 'DELETE_RECORD', `Deleted record: ${record.title}`);

    await record.deleteOne();

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
