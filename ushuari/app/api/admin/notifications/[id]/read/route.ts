// app/api/admin/notifications/[id]/read/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Notification ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Update the notification
    const updateResult = await db
      .collection("adminNotifications")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "read", readAt: new Date() } }
      );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
