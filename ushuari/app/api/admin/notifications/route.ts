// app/api/admin/notifications/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { type, organizationId, message } = await request.json();

    if (!type || !organizationId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Create a notification record for admins
    const notification = {
      recipientType: "admin",
      type,
      organizationId,
      message,
      status: "unread",
      createdAt: new Date(),
    };

    await db.collection("adminNotifications").insertOne(notification);

    // In a real application, you might also:
    // 1. Send an email notification to admins
    // 2. Push a real-time notification via WebSockets

    return NextResponse.json({
      success: true,
      message: "Admin notification created successfully",
    });
  } catch (error) {
    console.error("Error creating admin notification:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// Get notifications for admins
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");

    const db = await getDb();

    // Build query
    const query: any = {
      recipientType: "admin",
    };

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    // Get notifications
    const notifications = await db
      .collection("adminNotifications")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
