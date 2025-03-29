import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ushuari";
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  // If we have cached connections, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Connect to MongoDB
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();

  // Cache the connections
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Simple function to get the database instance
export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

// If you want to use mongoose models too
export async function connectMongoose() {
  if (mongoose.connection.readyState !== 1) {
    return await mongoose.connect(MONGODB_URI);
  }
  return mongoose.connection;
}
