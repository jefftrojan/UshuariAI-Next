// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const db = await getDb();

    // Get query parameters for filtering
    const url = new URL(request.url);
    const roleFilter = url.searchParams.get("role");
    const statusFilter = url.searchParams.get("status");

    // Build query
    const query: any = {};
    if (roleFilter) {
      query.role = roleFilter;
    }
    if (statusFilter && roleFilter === "organization") {
      query.organizationStatus = statusFilter;
    }

    // Get users and format them
    const users = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Transform MongoDB _id to id for frontend consistency
    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      organizationStatus: user.organizationStatus,
      createdAt: user.createdAt,
      // Don't include password
    }));

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
