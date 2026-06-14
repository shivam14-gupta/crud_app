const mongoose = require('mongoose');
const { BSON } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const backupDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const dbName = mongoose.connection.db.databaseName;
    console.log(`Database name: ${dbName}`);

    // Create backup directory structure
    const backupDir = path.join(__dirname, '..', 'backup', dbName);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Get all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const colInfo of collections) {
      const colName = colInfo.name;
      // Skip system collections if any
      if (colName.startsWith('system.')) continue;

      const collection = mongoose.connection.db.collection(colName);
      const docs = await collection.find({}).toArray();

      // Serialize each document to BSON and concatenate the buffers
      const buffers = [];
      for (const doc of docs) {
        // Serialize using the official BSON serializer
        const buf = BSON.serialize(doc);
        buffers.push(buf);
      }

      const finalBuffer = Buffer.concat(buffers);
      const bsonPath = path.join(backupDir, `${colName}.bson`);
      fs.writeFileSync(bsonPath, finalBuffer);

      // Create a basic metadata file as mongodump does
      const indexes = await collection.indexes();
      const metadata = {
        options: {},
        indexes: indexes.map(idx => ({
          v: idx.v || 2,
          key: idx.key,
          name: idx.name,
          ns: `${dbName}.${colName}`
        }))
      };
      
      const metadataPath = path.join(backupDir, `${colName}.metadata.json`);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`Exported ${docs.length} documents to backup/${dbName}/${colName}.bson`);
    }

    console.log('\nBackup successfully created in /backup/ directory!');
    process.exit(0);
  } catch (err) {
    console.error('Backup error:', err.message);
    process.exit(1);
  }
};

backupDatabase();
