const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Record = require('./models/Record');
const Request = require('./models/Request');
const Notification = require('./models/Notification');
const ActivityLog = require('./models/ActivityLog');

const exportData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const outDir = path.join(__dirname, 'db_seed');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    const collections = [
      { model: User, name: 'users' },
      { model: Record, name: 'records' },
      { model: Request, name: 'requests' },
      { model: Notification, name: 'notifications' },
      { model: ActivityLog, name: 'activitylogs' }
    ];

    for (const col of collections) {
      const data = await col.model.find({}).lean();
      const filePath = path.join(outDir, `${col.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Exported ${data.length} documents to db_seed/${col.name}.json`);
    }

    console.log('\nDatabase files successfully generated in /server/db_seed/');
    process.exit(0);
  } catch (err) {
    console.error('Export error:', err.message);
    process.exit(1);
  }
};

exportData();
