"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, checkAuth, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Effect to handle background animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      document.documentElement.style.setProperty('--scroll-position', `${scrollPosition * 0.1}px`);
      
      const orbs = document.querySelectorAll('.background-orb');
      orbs.forEach((orb, index) => {
        const element = orb as HTMLElement;
        const speed = 0.1 + (index * 0.05);
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();

      if (!isAuth) {
        router.push("/auth/login");
        return;
      }

      if (user?.role !== "admin") {
        const { user } = useAuthStore.getState();
        const path =
          user?.role === "admin"
            ? "/admin/dashboard"
            : user?.role === "organization"
            ? "/organization/dashboard"
            : "/dashboard";

        router.push(path);
        return;
      }

      setIsLoading(false);
    };

    init();
  }, [checkAuth, router, user]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Interactive Background */}
      <div className="fixed inset-0 bg-black overflow-hidden z-0 pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/30 to-black opacity-70"></div>
        
        {/* Animated orbs */}
        <div className="background-orb absolute -top-40 -right-40 w-96 h-96 rounded-full bg-green-500/20 blur-3xl animate-pulse"></div>
        <div className="background-orb absolute top-60 -left-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="background-orb absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-emerald-600/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-gray-900/80 backdrop-blur-md border-r border-green-900/20 text-white w-64 fixed h-full transition-all duration-300 z-10 ${
          isSidebarOpen ? "left-0" : "-left-64"
        }`}
      >
        <div className="p-4 border-b border-green-900/20 bg-green-950/50">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
            Ushuari
          </h2>
          <p className="text-emerald-100 text-sm">Admin Dashboard</p>
        </div>

        <nav className="mt-6">
          <ul>
            <li>
              <Link
                href="/admin/dashboard"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-900/50 text-emerald-100 hover:text-white"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/organizations"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-900/50 text-emerald-100 hover:text-white"
              >
                Organizations
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-900/50 text-emerald-100 hover:text-white"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/cases"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-900/50 text-emerald-100 hover:text-white"
              >
                Cases
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-green-900/20 bg-green-950/50">
          <button
            onClick={handleLogout}
            className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-900/50 text-emerald-100 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 relative ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } flex-1`}
      >
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-green-900/20 h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-emerald-300 hover:text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center">
            <span className="text-emerald-100 mr-2">{user?.name}</span>
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-medium">
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 relative">
          <div className="bg-gray-900/40 backdrop-blur-sm border border-green-900/20 rounded-2xl p-6 shadow-lg shadow-green-900/10">
            {children}
          </div>
        </main>
      </div>

      {/* Global styles */}
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