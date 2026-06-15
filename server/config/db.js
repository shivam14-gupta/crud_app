const mongoose = require('mongoose');

let cachedDb = null;
let lastError = null;
let connectionState = 'disconnected';

mongoose.connection.on('connected', () => { connectionState = 'connected'; });
mongoose.connection.on('disconnected', () => { connectionState = 'disconnected'; });
mongoose.connection.on('connecting', () => { connectionState = 'connecting'; });
mongoose.connection.on('disconnecting', () => { connectionState = 'disconnecting'; });

const connectDB = async () => {
  if (cachedDb) return cachedDb;

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

const getStatus = () => ({ state: connectionState, lastError });

module.exports = connectDB;
module.exports.getStatus = getStatus;