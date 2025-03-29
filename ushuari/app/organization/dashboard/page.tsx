// app/organization/dashboard/page.tsx
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

// Mock data for organization's assigned calls
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
    id: "2", // This is also in the user dashboard to simulate the connection
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
  const [organizationStatus, setOrganizationStatus] =
    useState<string>("pending");

  const router = useRouter();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();

  // Check authentication on load
  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push("/auth/login");
      } else if (user?.role !== "organization") {
        // Redirect to appropriate dashboard based on role
        if (user?.role === "admin") {
          router.push("/admin/dashboard");
        } else if (user?.role === "user") {
          router.push("/dashboard");
        }
      } else {
        // Set organization status
        if (user.organizationStatus) {
          setOrganizationStatus(user.organizationStatus);
        }

        // Only load calls if organization is approved
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If organization status is pending
  if (organizationStatus === "pending") {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-800">Ushuari</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-500"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Account Pending Approval
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Your organization account is currently pending approval by our
              administrators. You will receive full access to the platform once
              your account is approved.
            </p>
            <p className="text-gray-500 text-sm">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // If organization status is rejected
  if (organizationStatus === "rejected") {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-800">Ushuari</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Account Application Rejected
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're sorry, but your organization account application has been
              rejected. This may be due to incomplete information or not meeting
              our eligibility criteria.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              For more information, please contact our support team.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Regular dashboard for approved organizations
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">Ushuari</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Organization Dashboard
          </h2>
          <p className="text-gray-600">
            Manage and respond to legal assistance calls from users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Total Calls</h3>
            <p className="text-3xl font-bold text-blue-600">{calls.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Pending</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {calls.filter((c) => c.status === "pending").length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">In Progress</h3>
            <p className="text-3xl font-bold text-blue-500">
              {calls.filter((c) => c.status === "in-progress").length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Resolved</h3>
            <p className="text-3xl font-bold text-green-500">
              {calls.filter((c) => c.status === "resolved").length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Assigned Calls</h2>
          </div>

          {calls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No calls have been assigned to your organization yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Priority
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calls.map((call) => (
                    <tr key={call.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {call.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {call.description.substring(0, 50)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {call.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            call.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : call.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : call.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
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
                              ? "bg-green-100 text-green-800"
                              : call.priority === "medium"
                              ? "bg-blue-100 text-blue-800"
                              : call.priority === "high"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {call.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(call.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/organization/calls/${call.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          {call.status === "pending" && (
                            <button
                              onClick={() =>
                                updateCallStatus(call.id, "in-progress")
                              }
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Accept
                            </button>
                          )}
                          {call.status === "in-progress" && (
                            <button
                              onClick={() =>
                                updateCallStatus(call.id, "resolved")
                              }
                              className="text-green-600 hover:text-green-900"
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
