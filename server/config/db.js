const mongoose = require('mongoose');

let cachedDb = null;
let lastError = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    cachedDb = conn;
    lastError = null;
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    lastError = error.message;
    throw error;
  }
};

const getLastError = () => lastError;

module.exports = connectDB;
module.exports.getLastError = getLastError;