// app/auth/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, redirectToDashboard } = useAuthStore();

  useEffect(() => {
    // Check if role=admin is in the URL
    const role = searchParams.get("role");
    if (role === "admin") {
      setIsAdminLogin(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If admin login, pass the role
      const loginParams = isAdminLogin
        ? { email, password, role: "admin" }
        : { email, password };
      const success = await login(
        email,
        password,
        isAdminLogin ? "admin" : undefined
      );

      if (success) {
        const user = useAuthStore.getState().user;
        toast.success(`Welcome back, ${user?.name}!`);

        // Redirect to appropriate dashboard
        redirectToDashboard(router);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isAdminLogin ? "Admin Login" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isAdminLogin ? (
              <>
                Or{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  sign in as a regular user
                </Link>
              </>
            ) : (
              <>
                Or{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  create a new account
                </Link>
              </>
            )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading
                ? "Signing in..."
                : isAdminLogin
                ? "Sign in as Admin"
                : "Sign in"}
            </button>
          </div>

          {isAdminLogin && (
            <div className="text-center text-sm text-gray-500">
              <p>Admin access is restricted to authorized personnel only.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
