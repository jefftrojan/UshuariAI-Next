// Initialize MongoDB connection when the server starts
import { connectDatabase } from "@/lib/db";

// Connect to MongoDB on server startup
connectDatabase().catch(console.error);
