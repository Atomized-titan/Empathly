import mongoose from 'mongoose';

let isConnected = false; // Whether the database connection was initialized successfully

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  if (isConnected) {
    console.log('Using cached connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Database connection established');
  } catch (error) {
    console.error(error);
    throw error;
  }
};
