import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { connectMongoose } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "ushuari-jwt-secret";

export async function POST(request: Request) {
  try {
    const { name, email, password, role = "user" } = await request.json();
    console.log(`Registration attempt for: ${email}, role: ${role}`);

    if (!name || !email || !password) {
      console.log("Registration failed: Missing required fields");
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // For admin role, check if email is allowed
    if (role === "admin") {
      const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
      if (!adminEmails.includes(email)) {
        console.log(`Admin registration denied for non-admin email: ${email}`);
        return NextResponse.json(
          { success: false, message: "Not authorized to register as admin" },
          { status: 403 }
        );
      }
    }

    console.log("Testing database connection...");
    try {
      // Explicitly test connection
      await connectMongoose();
      console.log("Mongoose connection successful");
    } catch (dbConnectError) {
      console.error("Database connection error:", dbConnectError);
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error:
            process.env.NODE_ENV !== "production"
              ? dbConnectError.message
              : undefined,
        },
        { status: 500 }
      );
    }

    // Get database connection
    const db = await getDb();
    console.log("Database connection established for registration");

    // Check if user already exists
    try {
      const existingUser = await db.collection("users").findOne({ email });
      if (existingUser) {
        console.log(`User already exists with email: ${email}`);
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        );
      }
    } catch (findError) {
      console.error("Error checking existing user:", findError);
      return NextResponse.json(
        {
          success: false,
          message: "Error checking user existence",
          error:
            process.env.NODE_ENV !== "production"
              ? findError.message
              : undefined,
        },
        { status: 500 }
      );
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await hash(password, 10);
    console.log("Password hashed successfully");

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
      console.log("Creating organization record...");
      try {
        const orgResult = await db.collection("organizations").insertOne({
          name,
          email,
          status: "pending", // Organizations need admin approval
          createdAt: new Date(),
          contactPerson: name,
          specialties: [],
        });
        organizationId = orgResult.insertedId.toString();
        newUser.organizationId = organizationId;
        console.log("Organization created with ID:", organizationId);
      } catch (orgError) {
        console.error("Error creating organization:", orgError);
        return NextResponse.json(
          {
            success: false,
            message: "Error creating organization record",
            error:
              process.env.NODE_ENV !== "production"
                ? orgError.message
                : undefined,
          },
          { status: 500 }
        );
      }
    }

    // Insert user
    console.log("Inserting new user into database...");
    let result;
    try {
      result = await db.collection("users").insertOne(newUser);
      console.log(
        "User inserted successfully with ID:",
        result.insertedId.toString()
      );
    } catch (userInsertError) {
      console.error("Error inserting user:", userInsertError);

      // If organization was created, try to clean it up
      if (role === "organization" && organizationId) {
        try {
          await db
            .collection("organizations")
            .deleteOne({ _id: organizationId });
          console.log(
            "Cleanup: Removed organization after user insertion failure"
          );
        } catch (cleanupError) {
          console.error("Error cleaning up organization:", cleanupError);
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: "Error creating user account",
          error:
            process.env.NODE_ENV !== "production"
              ? userInsertError.message
              : undefined,
        },
        { status: 500 }
      );
    }

    // Create user object to return (without password)
    const userToReturn = {
      id: result.insertedId.toString(),
      name,
      email,
      role,
      ...(role === "organization" && { organizationId }),
    };

    // Create JWT token
    console.log("Generating JWT token...");
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
      secure: false, // Don't require HTTPS for development
      sameSite: "lax", // More permissive for development
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
    console.log("Authentication cookie set");

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during registration",
        error:
          process.env.NODE_ENV !== "production" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
