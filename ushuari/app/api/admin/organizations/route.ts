// app/api/admin/organizations/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    const db = await getDb();

    // Build query
    const query: any = {};
    if (status) {
      query.status = status;
    }

    // Get organizations
    const organizations = await db
      .collection("organizations")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Transform MongoDB _id to id for frontend consistency
    const formattedOrganizations = organizations.map((org) => ({
      id: org._id.toString(),
      name: org.name,
      email: org.email,
      description: org.description,
      status: org.status,
      createdAt: org.createdAt,
      contactPerson: org.contactPerson,
      specialties: org.specialties || [],
    }));

    return NextResponse.json({
      success: true,
      organizations: formattedOrganizations,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
