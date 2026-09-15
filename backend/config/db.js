import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tasksphere';
  
  try {
    // Attempt standard connection with 3s timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to primary MongoDB at ${uri} (${error.message}).`);
    console.log(`[Database] Starting embedded MongoDB Memory Server for seamless local execution...`);
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] Embedded MongoDB Memory Server Connected successfully at ${memUri}`);
    } catch (memErr) {
      console.error(`[Database] Error starting Memory Server:`, memErr);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
