// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/me",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = request.cookies.get("token")?.value;

  // If no token, redirect to login
  if (!token) {
    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // For page routes, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as any;
    const userRole = decoded.role;

    // Route protection based on role
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (userRole !== "admin") {
        // For API routes, return 403
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { success: false, message: "Access denied" },
            { status: 403 }
          );
        }

        // For page routes, redirect based on role
        if (userRole === "organization") {
          return NextResponse.redirect(
            new URL("/organization/dashboard", request.url)
          );
        } else {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    } else if (
      pathname.startsWith("/organization") ||
      pathname.startsWith("/api/organization")
    ) {
      if (userRole !== "organization") {
        // For API routes, return 403
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { success: false, message: "Access denied" },
            { status: 403 }
          );
        }

        // For page routes, redirect based on role
        if (userRole === "admin") {
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        } else {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    } else if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/api/dashboard")
    ) {
      if (userRole !== "user") {
        // For API routes, return 403
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { success: false, message: "Access denied" },
            { status: 403 }
          );
        }

        // For page routes, redirect based on role
        if (userRole === "admin") {
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        } else if (userRole === "organization") {
          return NextResponse.redirect(
            new URL("/organization/dashboard", request.url)
          );
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    // If token is invalid, clear it and redirect to login

    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // For page routes, redirect to login
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
