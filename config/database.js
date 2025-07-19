const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI; // Use this correctly!

  if (!uri) {
    console.error('❌ MONGO_URI is undefined. Please check your .env file and how you load dotenv.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
