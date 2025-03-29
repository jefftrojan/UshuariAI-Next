// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Find the user by email
    const user = await db.collection("users").findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // If user is an organization, fetch organization data
    let organizationData = null;
    if (user.role === "organization" && user.organizationId) {
      organizationData = await db.collection("organizations").findOne({
        _id: new ObjectId(user.organizationId),
      });
    }

    // Create a clean user object (without password) to return
    const userToReturn = {
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
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // Create the response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: userToReturn,
      token,
    });

    // Set token as HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
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
