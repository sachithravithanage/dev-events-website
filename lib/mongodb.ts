import mongoose from 'mongoose';

/**
 * Global type declaration for mongoose connection caching
 * This prevents TypeScript errors when accessing global.mongoose
 */
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that MONGODB_URI is defined
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global variable to cache the mongoose connection
 * This is necessary because in development, Next.js hot reloading can cause
 * multiple connections to be created, which can exhaust database connections
 */
let cached = global.mongoose;

// Initialize the cache if it doesn't exist
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes and returns a cached MongoDB connection
 * 
 * @returns {Promise<mongoose.Connection>} The active MongoDB connection
 * 
 * This function implements connection pooling by:
 * 1. Returning existing connection if available
 * 2. Reusing pending connection promise if connection is in progress
 * 3. Creating new connection only when necessary
 */
async function connectDB(): Promise<mongoose.Connection> {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If no cached connection but a promise exists, wait for it
  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering
    };

    // Create new connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, options).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error to allow retry on next call
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
