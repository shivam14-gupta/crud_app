const User = require('../models/User');
const Record = require('../models/Record');
const Request = require('../models/Request');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

const initDB = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('Database already seeded, skipping init');
    return;
  }

  console.log('Seeding database with initial data...');

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });

  const user1 = await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
  });

  const user2 = await User.create({
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
  });

  const record1 = await Record.create({
    title: 'Project Proposal',
    description: 'Initial project proposal for Q4',
    createdBy: user1._id,
    status: 'approved',
  });

  const record2 = await Record.create({
    title: 'Budget Report',
    description: 'Quarterly budget review',
    createdBy: user2._id,
    status: 'pending',
  });

  const record3 = await Record.create({
    title: 'Marketing Plan',
    description: 'Digital marketing strategy for 2025',
    createdBy: user1._id,
    status: 'pending',
  });

  await Request.create({
    userId: user1._id,
    recordId: record1._id,
    status: 'approved',
    feedback: 'Approved with minor revisions',
  });

  await Request.create({
    userId: user2._id,
    recordId: record2._id,
    status: 'pending',
  });

  await Notification.create({
    userId: user1._id,
    title: 'Welcome',
    message: 'Welcome to the platform!',
  });

  await Notification.create({
    userId: user2._id,
    title: 'Welcome',
    message: 'Welcome to the platform!',
  });

  await ActivityLog.create([
    { userId: admin._id, action: 'SEED', description: 'Database seeded with initial data' },
    { userId: user1._id, action: 'REGISTER', description: 'User registered' },
    { userId: user2._id, action: 'REGISTER', description: 'User registered' },
  ]);

  console.log('Database seeded successfully');
  console.log('Admin: admin@example.com / admin123');
  console.log('User:  john@example.com / user123');
  console.log('User:  jane@example.com / user123');
};

module.exports = initDB;