"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { ensureCorrectRoleAccess } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Only allow users with "admin" role
      const hasAccess = await ensureCorrectRoleAccess(router, ["admin"]);
      setIsLoading(false);
    };

    checkAccess();
  }, [ensureCorrectRoleAccess, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 fixed h-full transition-all duration-300 ${
          isSidebarOpen ? "left-0" : "-left-64"
        }`}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Ushuari</h2>
          <p className="text-gray-300 text-sm">Admin Dashboard</p>
        </div>

        <nav className="mt-6">
          <ul>
            <li>
              <Link
                href="/admin/dashboard"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/organizations"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              >
                Organizations
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/cases"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              >
                Cases
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } flex-1`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 focus:outline-none"
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
            <span className="text-gray-800 mr-2">{user.name}</span>
            <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-medium">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
