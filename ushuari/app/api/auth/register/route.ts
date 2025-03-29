import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ushuari-jwt-secret";

export async function POST(request: Request) {
  try {
    const { name, email, password, role = "user" } = await request.json();

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

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add organization data if registering as organization
    let organizationId;
    if (role === "organization") {
      const orgResult = await db.collection("organizations").insertOne({
        name,
        email,
        status: "pending",
        createdAt: new Date(),
        contactPerson: name,
        specialties: [],
      });
      organizationId = orgResult.insertedId.toString();
      newUser.organizationId = organizationId;
    }

    // Insert user
    const result = await db.collection("users").insertOne(newUser);

    // Create user object to return (without password)
    const userToReturn = {
      id: result.insertedId.toString(),
      name,
      email,
      role,
      ...(role === "organization" && { organizationId }),
    };

    // Create JWT token
    const token = jwt.sign(
      { id: result.insertedId.toString(), role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: userToReturn,
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
