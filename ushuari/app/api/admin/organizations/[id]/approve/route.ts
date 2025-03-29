// app/api/admin/organizations/[id]/approve/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!id || !status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    console.log(`Updating organization ${id} to status: ${status}`);

    const db = await getDb();

    // Update the organization status
    const updateResult = await db
      .collection("organizations")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } }
      );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Organization not found" },
        { status: 404 }
      );
    }

    // Find the organization
    const organization = await db
      .collection("organizations")
      .findOne({ _id: new ObjectId(id) });

    // Also update the status in the user document
    await db
      .collection("users")
      .updateOne(
        { organizationId: id },
        { $set: { organizationStatus: status, updatedAt: new Date() } }
      );

    // In a real app, you might want to send an email notification to the organization

    return NextResponse.json({
      success: true,
      message: `Organization ${status} successfully`,
      organization,
    });
  } catch (error) {
    console.error("Error updating organization status:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
