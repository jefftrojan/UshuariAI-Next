// app/api/organizations/[id]/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, description, contactPerson, specialties } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Organization ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Update the organization details
    const updateResult = await db.collection("organizations").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          ...(contactPerson && { contactPerson }),
          ...(specialties && { specialties }),
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Organization not found" },
        { status: 404 }
      );
    }

    // Get the updated organization
    const organization = await db.collection("organizations").findOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      success: true,
      message: "Organization updated successfully",
      organization,
    });
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
