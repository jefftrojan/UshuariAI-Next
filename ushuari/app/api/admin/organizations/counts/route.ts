// app/api/admin/organizations/counts/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const db = await getDb();

    // Get counts for each status
    const [pendingCount, approvedCount, rejectedCount, totalCount] =
      await Promise.all([
        db.collection("organizations").countDocuments({ status: "pending" }),
        db.collection("organizations").countDocuments({ status: "approved" }),
        db.collection("organizations").countDocuments({ status: "rejected" }),
        db.collection("organizations").countDocuments({}),
      ]);

    return NextResponse.json({
      success: true,
      counts: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching organization counts:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
