"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Call {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  createdAt: string;
  userId: string;
  userName?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

const MOCK_ORG_CALLS: Call[] = [
  {
    id: "101",
    title: "Employment Contract Dispute",
    description: "Employee claims unfair termination",
    status: "pending",
    createdAt: new Date().toISOString(),
    userId: "5",
    userName: "John Smith",
    priority: "high",
  },
  {
    id: "102",
    title: "Tenant Rights Question",
    description: "Tenant seeking advice on rental agreement",
    status: "in-progress",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "6",
    userName: "Emily Johnson",
    priority: "medium",
  },
  {
    id: "2",
    title: "Landlord Dispute",
    description: "My landlord is refusing to fix a leaking pipe",
    status: "in-progress",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "3",
    userName: "Alex Williams",
    priority: "high",
  },
];

export default function OrganizationDashboard() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationStatus, setOrganizationStatus] = useState<string>("pending");

  const router = useRouter();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push("/auth/login");
      } else if (user?.role !== "organization") {
        if (user?.role === "admin") {
          router.push("/admin/dashboard");
        } else if (user?.role === "user") {
          router.push("/dashboard");
        }
      } else {
        if (user.organizationStatus) {
          setOrganizationStatus(user.organizationStatus);
        }
        if (user.organizationStatus === "approved") {
          setCalls(MOCK_ORG_CALLS);
        }
        setIsLoading(false);
      }
    };
    init();
  }, [checkAuth, router, user]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
    toast.success("Logged out successfully");
  };

  const updateCallStatus = (
    callId: string,
    newStatus: "pending" | "in-progress" | "resolved" | "rejected"
  ) => {
    setCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, status: newStatus } : c))
    );
    toast.success(`Call status updated to ${newStatus}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Status screens
  if (organizationStatus === "pending") {
    return (
      <div className="min-h-screen bg-black">
        <header className="bg-gray-900 border-b border-green-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Ushuari</h1>
            <div className="flex items-center space-x-4">
              <span className="text-white/80">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-900/80 border border-green-900/20 rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-4 border border-yellow-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Account Pending Approval
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Your organization account is currently pending approval by our
              administrators. You will receive full access to the platform once
              your account is approved.
            </p>
            <p className="text-white/50 text-sm">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (organizationStatus === "rejected") {
    return (
      <div className="min-h-screen bg-black">
        <header className="bg-gray-900 border-b border-red-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Ushuari</h1>
            <div className="flex items-center space-x-4">
              <span className="text-white/80">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-900/80 border border-red-900/20 rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4 border border-red-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Account Application Rejected
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              We're sorry, but your organization account application has been
              rejected. This may be due to incomplete information or not meeting
              our eligibility criteria.
            </p>
            <p className="text-white/50 text-sm mb-6">
              For more information, please contact our support team.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 border border-gray-700"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Main dashboard for approved organizations
  return (
    <div className="min-h-screen bg-black/30 rounded-2xl">
      <header className="bg-gray-900 border-b border-green-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Ushuari</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white/80">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Organization Dashboard
          </h2>
          <p className="text-white/70">
            Manage and respond to legal assistance calls from users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/80 border border-green-900/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white/80 mb-4">Total Calls</h3>
            <p className="text-3xl font-bold text-white">{calls.length}</p>
          </div>

          <div className="bg-gray-900/80 border border-yellow-900/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white/80 mb-4">Pending</h3>
            <p className="text-3xl font-bold text-white">
              {calls.filter((c) => c.status === "pending").length}
            </p>
          </div>

          <div className="bg-gray-900/80 border border-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white/80 mb-4">In Progress</h3>
            <p className="text-3xl font-bold text-white">
              {calls.filter((c) => c.status === "in-progress").length}
            </p>
          </div>

          <div className="bg-gray-900/80 border border-emerald-900/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white/80 mb-4">Resolved</h3>
            <p className="text-3xl font-bold text-white">
              {calls.filter((c) => c.status === "resolved").length}
            </p>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-green-900/20 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-white">Assigned Calls</h2>
          </div>

          {calls.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              No calls have been assigned to your organization yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                    >
                      Priority
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {calls.map((call) => (
                    <tr key={call.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {call.title}
                        </div>
                        <div className="text-sm text-white/50">
                          {call.description.substring(0, 50)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {call.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            call.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : call.status === "in-progress"
                              ? "bg-blue-500/10 text-blue-400"
                              : call.status === "resolved"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {call.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            call.priority === "low"
                              ? "bg-green-500/10 text-green-400"
                              : call.priority === "medium"
                              ? "bg-blue-500/10 text-blue-400"
                              : call.priority === "high"
                              ? "bg-orange-500/10 text-orange-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {call.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                        {new Date(call.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/organization/calls/${call.id}`}
                            className="text-green-400 hover:text-green-300"
                          >
                            View
                          </Link>
                          {call.status === "pending" && (
                            <button
                              onClick={() =>
                                updateCallStatus(call.id, "in-progress")
                              }
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Accept
                            </button>
                          )}
                          {call.status === "in-progress" && (
                            <button
                              onClick={() =>
                                updateCallStatus(call.id, "resolved")
                              }
                              className="text-green-400 hover:text-green-300"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}