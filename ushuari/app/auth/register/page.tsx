"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

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
      
      {/* Registration Selection Form */}
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
              Create an account
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Or{" "}
              <Link
                href="/auth/login"
                className="font-medium text-green-400 hover:text-green-300 transition-colors"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <Link href="/auth/register/user">
                <div className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300">
                  Register as Individual User
                </div>
              </Link>
            </div>

            <div>
              <Link href="/auth/register/organization">
                <div className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-700 to-emerald-800 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300">
                  Register as Organization
                </div>
              </Link>
            </div>
          </div>
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