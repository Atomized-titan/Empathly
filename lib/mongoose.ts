import mongoose from 'mongoose';

(global as any).isConnected = false; // Whether the database connection was initialized successfully

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  if ((global as any).isConnected) {
    console.log('Using cached connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    (global as any).isConnected = true;
    console.log('Database connection established');
  } catch (error) {
    console.error(error);
    throw error;
  }
};
