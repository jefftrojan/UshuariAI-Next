import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ushuari-jwt-secret";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/me",
];

// Role-based route prefixes
const ROLE_ROUTES = {
  admin: ["/admin", "/api/admin"],
  organization: ["/organization", "/api/organization"],
  user: ["/dashboard", "/api/dashboard"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  // If no token, redirect to login or return 401 for API routes
  if (!token) {
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
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };
    const userRole = decoded.role as "admin" | "organization" | "user";

    // Check role-based route access
    for (const [role, prefixes] of Object.entries(ROLE_ROUTES)) {
      if (prefixes.some((prefix) => pathname.startsWith(prefix))) {
        if (role !== userRole) {
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
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token
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
