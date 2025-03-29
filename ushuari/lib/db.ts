import { MongoClient } from "mongodb";
import mongoose from "mongoose";

// Use environment variable or default to localhost
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ushuari";

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;
let isConnecting = false;
let connectionError: Error | null = null;

console.log(
  "MongoDB connection string:",
  MONGODB_URI.replace(/mongodb:\/\/([^:]+):([^@]+)@/, "mongodb://***:***@")
);

export async function connectToDatabase() {
  // If we have cached connections, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If there was a recent connection error, don't retry immediately
  if (connectionError) {
    console.error("Recent connection error:", connectionError);
    throw connectionError;
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    console.log("Database connection is already in progress, waiting...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return connectToDatabase();
  }

  try {
    isConnecting = true;
    console.log("Connecting to MongoDB...");

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI, {
      // Add these options for better connection reliability
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });

    await client.connect();
    console.log("MongoDB client connected successfully");

    const db = client.db();

    // Verify connection with a simple operation
    await db.command({ ping: 1 });
    console.log("MongoDB ping successful");

    // Cache the connections
    cachedClient = client;
    cachedDb = db;
    connectionError = null;

    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    connectionError = error as Error;
    throw error;
  } finally {
    isConnecting = false;
  }
}

// Simple function to get the database instance
export async function getDb() {
  try {
    const { db } = await connectToDatabase();
    return db;
  } catch (error) {
    console.error("getDb error:", error);
    throw error;
  }
}

// For mongoose models
export async function connectMongoose() {
  try {
    console.log("Connecting to MongoDB via Mongoose...");

    if (mongoose.connection.readyState !== 1) {
      mongoose.set("strictQuery", true);
      await mongoose.connect(MONGODB_URI);
      console.log("Mongoose connected successfully");
    } else {
      console.log("Mongoose already connected");
    }

    return mongoose;
  } catch (error) {
    console.error("Mongoose connection error:", error);
    throw error;
  }
}

// Export mongoose for use with schemas
export { mongoose };
