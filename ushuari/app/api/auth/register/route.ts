// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { name, email, password, role = "user" } = await request.json();

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Prepare user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If registering as an organization, add organization info (pending approval)
    if (role === "organization") {
      const organizationInfo = {
        name: name, // Use the provided name as organization name initially
        email,
        status: "pending", // New organizations start as pending
        createdAt: new Date(),
        contactPerson: name,
        specialties: [],
      };

      // Insert organization in the database
      const orgResult = await db
        .collection("organizations")
        .insertOne(organizationInfo);

      // Add organization reference to user
      newUser.organizationId = orgResult.insertedId.toString();
    }

    // Insert user in the database
    const result = await db.collection("users").insertOne(newUser);

    // Create a clean user object (without password) to return
    const userToReturn = {
      id: result.insertedId.toString(),
      name,
      email,
      role,
      ...(role === "organization"
        ? { organizationId: newUser.organizationId }
        : {}),
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertedId.toString(), role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // Create the response
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: userToReturn,
        token,
      },
      { status: 201 }
    );

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
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
