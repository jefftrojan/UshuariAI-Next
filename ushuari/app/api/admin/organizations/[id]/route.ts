// app/api/admin/organizations/[id]/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Organization ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Get the organization
    const organization = await db.collection("organizations").findOne({
      _id: new ObjectId(id),
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, message: "Organization not found" },
        { status: 404 }
      );
    }

    // Format the organization for frontend
    const formattedOrganization = {
      id: organization._id.toString(),
      name: organization.name,
      email: organization.email,
      description: organization.description,
      status: organization.status,
      createdAt: organization.createdAt,
      contactPerson: organization.contactPerson,
      specialties: organization.specialties || [],
      notes: organization.notes,
      updatedAt: organization.updatedAt,
    };

    return NextResponse.json({
      success: true,
      organization: formattedOrganization,
    });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
