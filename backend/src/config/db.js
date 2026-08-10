const mongoose = require('mongoose');

// Helper function to establish connection with MongoDB
const connectDB = async () => {
  try {
    // process.env.MONGO_URI is loaded from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure code if connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
