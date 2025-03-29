// lib/db.ts
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ushuari";

// Create MongoDB client
export const client = new MongoClient(MONGODB_URI);

// Connect to MongoDB with both mongoose and native client
export const connectDatabase = async () => {
  try {
    // Connect with MongoDB client
    await client.connect();

    // Connect with mongoose
    await mongoose.connect(MONGODB_URI);

    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process with a non-zero status code
  }
};

// Event listeners for mongoose connection
mongoose.connection.on("disconnected", () => {
  console.log("❗MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

// Helper function to get database from MongoDB client
export const getDb = async () => {
  if (!client.topology || !client.topology.isConnected()) {
    await connectDatabase();
  }
  return client.db();
};

// Export mongoose for schema-based models
export { mongoose };
