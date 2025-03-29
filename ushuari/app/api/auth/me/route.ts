import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = await cookieStore.get("token")?.value;

    // Check if token exists
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "ushuari-jwt-secret"
    ) as any;

    // Get database instance
    const db = await getDb();

    // Find the user
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.id) });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // If user is an organization, fetch organization data
    let organizationData = null;
    if (user.role === "organization" && user.organizationId) {
      organizationData = await db.collection("organizations").findOne({
        _id: new ObjectId(user.organizationId),
      });
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
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 }
    );
  }
}
