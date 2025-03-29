import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "ushuari-jwt-secret";

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Query with role if specified (helpful for admin login)
    const query: any = { email };
    if (role) {
      query.role = role;
    }

    const user = await db.collection("users").findOne(query);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // If admin login, verify email is in allowed list
    if (user.role === "admin") {
      const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
      if (!adminEmails.includes(user.email)) {
        return NextResponse.json(
          { success: false, message: "Not authorized as admin" },
          { status: 403 }
        );
      }
    }

    // Get organization data if user is organization
    let organizationData = null;
    if (user.role === "organization" && user.organizationId) {
      organizationData = await db.collection("organizations").findOne({
        _id: new ObjectId(user.organizationId),
      });
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

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: userToReturn,
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
