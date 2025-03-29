// app/api/admin/notifications/mark-all-read/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { type } = await request.json();

    const db = await getDb();

    // Build query
    const query: any = {
      recipientType: "admin",
      status: "unread",
    };

    if (type) {
      query.type = type;
    }

    // Update all matching notifications
    const updateResult = await db
      .collection("adminNotifications")
      .updateMany(query, {
        $set: {
          status: "read",
          readAt: new Date(),
        },
      });

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
      count: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
