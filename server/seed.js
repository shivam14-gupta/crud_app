const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Record = require('./models/Record');
const Request = require('./models/Request');
const Notification = require('./models/Notification');
const ActivityLog = require('./models/ActivityLog');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Record.deleteMany({}),
      Request.deleteMany({}),
      Notification.deleteMany({}),
      ActivityLog.deleteMany({}),
    ]);
    console.log('Cleared existing data');

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

    console.log('Users created');

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

    console.log('Records created');

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

    console.log('Requests created');

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

    console.log('Notifications created');

    await ActivityLog.create([
      { userId: admin._id, action: 'SEED', description: 'Database seeded with initial data' },
      { userId: user1._id, action: 'REGISTER', description: 'User registered' },
      { userId: user2._id, action: 'REGISTER', description: 'User registered' },
    ]);

    console.log('Activity logs created');
    console.log('\n--- Seed Complete ---');
    console.log('Admin: admin@example.com / admin123');
    console.log('User:  john@example.com / user123');
    console.log('User:  jane@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
