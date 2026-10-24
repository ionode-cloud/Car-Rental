import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(` MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(` Initial connection to ${uri} failed: ${error.message}`);
    }
  }

  // Fallback 1: Try default local MongoDB
  try {
    const localUri = 'mongodb://127.0.0.1:27017/ridevista';
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(` MongoDB Connected (Local): ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.log(' Local MongoDB not reachable. Initializing MongoMemoryServer fallback...');
  }

  // Fallback 2: Start In-Memory MongoDB Server for seamless development/testing
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(` MongoDB Connected (In-Memory Database Ready): ${conn.connection.host}`);
    return conn;
  } catch (memErr) {
    console.error(` Failed to initialize database: ${memErr.message}`);
    process.exit(1);
  }
};

export default connectDB;
