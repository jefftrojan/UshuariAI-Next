import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

// Ensure a consistent secret across the app
const JWT_SECRET = process.env.JWT_SECRET || "ushuari-jwt-secret";

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    console.log(`Login attempt for email: ${email}, role: ${role || "any"}`);

    if (!email || !password) {
      console.log("Login failed: Missing email or password");
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    console.log("Database connection established for login");

    // Query with role if specified (helpful for admin login)
    const query: any = { email };
    if (role) {
      query.role = role;
    }

    const user = await db.collection("users").findOne(query);

    if (!user) {
      console.log(`User not found with email: ${email}`);
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log(`User found: ${user.name}, role: ${user.role}`);

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password verification failed");
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("Password verified successfully");

    // If admin login, verify email is in allowed list
    if (user.role === "admin") {
      const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
      if (!adminEmails.includes(user.email)) {
        console.log(`Admin login denied for non-admin email: ${user.email}`);
        return NextResponse.json(
          { success: false, message: "Not authorized as admin" },
          { status: 403 }
        );
      }
      console.log("Admin access granted");
    }

    // Get organization data if user is organization
    let organizationData = null;
    if (user.role === "organization" && user.organizationId) {
      organizationData = await db.collection("organizations").findOne({
        _id: new ObjectId(user.organizationId),
      });
      console.log("Organization data found:", !!organizationData);
    }

    // Create user object to return (without password)
    const userToReturn = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      ...(user.role === "organization" && {
        organizationId: user.organizationId,
        organizationStatus: organizationData?.status || "pending",
      }),
    };

    // Create JWT token
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("JWT token generated:", token.substring(0, 20) + "...");

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: userToReturn,
    });

    // Set token as HTTP-only cookie with development-friendly settings
    const isDevEnvironment = process.env.NODE_ENV !== "production";
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: !isDevEnvironment, // Only require HTTPS in production
      sameSite: "lax", // More permissive for development
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    console.log("Cookie set with options:", {
      httpOnly: true,
      secure: !isDevEnvironment,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
