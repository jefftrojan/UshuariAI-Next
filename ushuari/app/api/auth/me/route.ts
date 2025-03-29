import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    console.log("Auth check - Cookie token present:", !!token);

    // Check if token exists
    if (!token) {
      console.log("Auth check failed: No token in cookies");
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || "ushuari-jwt-secret";
    console.log(
      "Using JWT_SECRET:",
      JWT_SECRET ? "Secret is set" : "Using default secret"
    );

    try {
      // Verify token with explicit logging
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log("Token verified successfully. User ID:", decoded.id);

      // Get database instance
      const db = await getDb();
      console.log("Database connection established");

      // Find the user
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(decoded.id) });

      // Check if user exists
      if (!user) {
        console.log("User not found in database:", decoded.id);
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      console.log("User found:", user.name, "with role:", user.role);

      // If user is an organization, fetch organization data
      let organizationData = null;
      if (user.role === "organization" && user.organizationId) {
        organizationData = await db.collection("organizations").findOne({
          _id: new ObjectId(user.organizationId),
        });
        console.log("Organization data found:", !!organizationData);
      }

      // Return user data (without password)
      return NextResponse.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          ...(user.role === "organization"
            ? {
                organizationId: user.organizationId,
                organizationStatus: organizationData?.status || "pending",
              }
            : {}),
        },
      });
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 }
    );
  }
}
