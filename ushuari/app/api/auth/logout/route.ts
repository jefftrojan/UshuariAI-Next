import { NextResponse } from "next/server";

export async function POST() {
  // Create response
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear the auth cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
