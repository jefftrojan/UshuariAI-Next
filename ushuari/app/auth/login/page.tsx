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
    <div className="min-h-screen bg-black relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="fixed inset-0 bg-black overflow-hidden z-0 pointer-events-none">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/30 to-black opacity-70"></div>
        
        {/* Animated orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-green-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-emerald-600/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      {/* Login Form */}
      <div className="relative z-10 max-w-md w-full">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
        <div className="relative bg-gray-900/60 backdrop-blur-md border border-green-500/20 p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-green-500/10 hover:shadow-lg">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
                Ushuari
              </h1>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-white">
              {isAdminLogin ? "Admin Login" : "Sign in to your account"}
            </h2>
            <p className="mt-2 text-sm text-white/70">
              {isAdminLogin ? (
                <>
                  Or{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-green-400 hover:text-green-300 transition-colors"
                  >
                    sign in as a regular user
                  </Link>
                </>
              ) : (
                <>
                  Or{" "}
                  <Link
                    href="/auth/register"
                    className="font-medium text-green-400 hover:text-green-300 transition-colors"
                  >
                    create a new account
                  </Link>
                </>
              )}
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-white/80 mb-1">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-800/70 border border-green-900/30 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-800/70 border border-green-900/30 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Enter your password"
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
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-green-900/30 rounded bg-gray-800/70"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-white/80"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="#"
                  className="font-medium text-green-400 hover:text-green-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white rounded-md font-medium text-center transition-all duration-300 shadow-lg shadow-green-900/20"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : isAdminLogin ? (
                  "Sign in as Admin"
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            {isAdminLogin && (
              <div className="text-center text-sm text-white/50">
                <p>Admin access is restricted to authorized personnel only.</p>
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* Add global styles for the continuous background animation */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}