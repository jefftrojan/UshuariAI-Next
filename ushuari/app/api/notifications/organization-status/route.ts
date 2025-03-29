// app/api/notifications/organization-status/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const { organizationId, status, message } = await request.json();

    if (!organizationId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Find the organization
    const organization = await db.collection("organizations").findOne({
      _id: new ObjectId(organizationId),
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, message: "Organization not found" },
        { status: 404 }
      );
    }

    // Create a notification record
    const notification = {
      recipientType: "organization",
      recipientId: organizationId,
      title: `Organization Status Update: ${status}`,
      message:
        message || `Your organization status has been updated to: ${status}`,
      status: "unread",
      createdAt: new Date(),
      relatedTo: {
        type: "organization_status",
        id: organizationId,
      },
    };

    await db.collection("notifications").insertOne(notification);

    // In a real application, you might also:
    // 1. Send an email notification
    // 2. Push a real-time notification via WebSockets

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
