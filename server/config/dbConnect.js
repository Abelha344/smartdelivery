
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Default to local mongodb if variable is not set
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mds';
    
    const conn = await mongoose.connect(uri);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Please ensure MongoDB is running locally on port 27017 or set MONGO_URI in .env');
    // Do not exit process in dev mode to allow server to stay up for debugging, 
    // though functionality will be broken
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
