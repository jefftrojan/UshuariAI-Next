// middleware.ts - with enhanced debugging
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Using jose for edge runtime compatibility

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/register/user",
  "/auth/register/organization",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/me",
  "/api/auth/logout",
];

// Role-based route prefixes
const ROLE_ROUTES = {
  admin: ["/admin", "/api/admin"],
  organization: ["/organization", "/api/organization"],
  user: ["/dashboard", "/api/dashboard"],
};

// Helper function to verify JWT in edge runtime
async function verifyJWT(token: string) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "ushuari-jwt-secret";
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    console.log("JWT verified successfully", payload);
    return { verified: true, payload };
  } catch (error) {
    console.error("JWT verification failed", error);
    return { verified: false, payload: null };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`Processing request to: ${pathname}`);

  // Check if the route is public
  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    console.log(`Public route access: ${pathname}`);
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  // If no token, redirect to login or return 401 for API routes
  if (!token) {
    console.log(`No token found, redirecting from: ${pathname}`);
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    // Verify token
    const { verified, payload } = await verifyJWT(token);

    if (!verified || !payload) {
      throw new Error("Invalid token");
    }

    const userRole = payload.role as "admin" | "organization" | "user";
    console.log(`User authenticated with role: ${userRole}`);

    // Check role-based route access
    for (const [role, prefixes] of Object.entries(ROLE_ROUTES)) {
      if (prefixes.some((prefix) => pathname.startsWith(prefix))) {
        if (role !== userRole) {
          console.log(
            `Role mismatch. Required: ${role}, User has: ${userRole}`
          );
          // For API routes, return 403
          if (pathname.startsWith("/api/")) {
            return NextResponse.json(
              { success: false, message: "Access denied" },
              { status: 403 }
            );
          }

          // Redirect to appropriate dashboard
          const redirectPath =
            ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES][0];
          console.log(`Redirecting to: ${redirectPath}`);
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token
    console.error("Auth error in middleware:", error);
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Delete token and redirect to login
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
