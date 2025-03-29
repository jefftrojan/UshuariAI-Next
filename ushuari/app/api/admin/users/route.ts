// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const roleFilter = url.searchParams.get("role");

    const db = await getDb();

    // Build query
    const query: any = {};
    if (roleFilter) {
      query.role = roleFilter;
    }

    // Get users from the database
    const users = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Transform users for frontend
    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        let organizationStatus;

        // If user is an organization, fetch the organization status
        if (user.role === "organization" && user.organizationId) {
          try {
            const organization = await db.collection("organizations").findOne({
              _id: new ObjectId(user.organizationId),
            });

            if (organization) {
              organizationStatus = organization.status;
            }
          } catch (error) {
            console.error("Error fetching organization:", error);
          }
        }

        return {
          id: user._id.toString(),
          name: user.name || "Unknown",
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          organizationId: user.organizationId,
          organizationStatus:
            organizationStatus || user.organizationStatus || "pending",
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
