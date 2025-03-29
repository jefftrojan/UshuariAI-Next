// app/api/organizations/status/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // First get the user to find the organizationId
    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.organizationId) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not associated with an organization",
        },
        { status: 400 }
      );
    }

    // Now get the organization status
    const organization = await db.collection("organizations").findOne({
      _id: new ObjectId(user.organizationId),
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, message: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      status: organization.status,
      organizationId: organization._id.toString(),
      name: organization.name,
    });
  } catch (error) {
    console.error("Error fetching organization status:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
