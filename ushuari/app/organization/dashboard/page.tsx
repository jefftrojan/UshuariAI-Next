// app/organization/dashboard/page.tsx - Fixed version
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import Link from "next/link";
import axios from "axios";
import OrganizationApprovalNotification from "@/components/OrganizationApprovalNotification";

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
  const [organizationStatus, setOrganizationStatus] =
    useState<string>("pending");
  const [showStatusBanner, setShowStatusBanner] = useState(true);

  const router = useRouter();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();

  // Check authentication on load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const isAuth = await checkAuth();

      if (!isAuth) {
        router.push("/auth/login");
        return;
      }

      if (user?.role !== "organization") {
        // Redirect to appropriate dashboard based on role
        if (user?.role === "admin") {
          router.push("/admin/dashboard");
        } else if (user?.role === "user") {
          router.push("/dashboard");
        }
        return;
      }

      // Get the latest organization status directly from the database
      try {
        const response = await axios.get(
          `/api/organizations/status?userId=${user.id}`
        );
        if (response.data.success) {
          setOrganizationStatus(response.data.status);

          // Only load calls if organization is approved
          if (response.data.status === "approved") {
            setCalls(MOCK_ORG_CALLS);
          }
        } else {
          // Fallback to user object if API fails
          if (user.organizationStatus) {
            setOrganizationStatus(user.organizationStatus);

            if (user.organizationStatus === "approved") {
              setCalls(MOCK_ORG_CALLS);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching organization status:", error);
        // Fallback to user object
        if (user.organizationStatus) {
          setOrganizationStatus(user.organizationStatus);

          if (user.organizationStatus === "approved") {
            setCalls(MOCK_ORG_CALLS);
          }
        }
      } finally {
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
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-3">What happens next?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center mr-2 font-medium">
                      1
                    </span>
                    <h4 className="font-medium">Admin Review</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Our admin team is reviewing your organization details
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center mr-2 font-medium">
                      2
                    </span>
                    <h4 className="font-medium">Approval Decision</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    We'll make a decision within 1-2 business days
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center mr-2 font-medium">
                      3
                    </span>
                    <h4 className="font-medium">Get Started</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Upon approval, you'll get full access to calls and features
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              If you have any questions, please contact our support team at{" "}
              <a
                href="mailto:support@ushuari.com"
                className="text-blue-600 hover:underline"
              >
                support@ushuari.com
              </a>
            </p>

            {/* Add refresh button */}
            <button
              onClick={async () => {
                setIsLoading(true);
                await checkAuth();
                window.location.reload();
              }}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Check Approval Status
            </button>
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
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-3">What you can do next</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Contact Support</h4>
                  <p className="text-sm text-gray-600">
                    Reach out to our support team for more information about why
                    your application was rejected and how you can improve it.
                  </p>
                  <a
                    href="mailto:support@ushuari.com"
                    className="text-blue-600 hover:underline text-sm inline-block mt-2"
                  >
                    Email support@ushuari.com
                  </a>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Reapply</h4>
                  <p className="text-sm text-gray-600">
                    You may be able to reapply after addressing the issues with
                    your application. Please wait at least 30 days before
                    reapplying.
                  </p>
                  <button
                    className="text-blue-600 hover:underline text-sm inline-block mt-2"
                    onClick={() =>
                      toast.success(
                        "Reapplication will be available after 30 days."
                      )
                    }
                  >
                    Reapply after 30 days
                  </button>
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              For more information, please contact our support team at{" "}
              <a
                href="mailto:support@ushuari.com"
                className="text-blue-600 hover:underline"
              >
                support@ushuari.com
              </a>
            </p>
            <button
              onClick={handleLogout}
              className="mt-8 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Home
            </button>

            {/* Add refresh button */}
            <button
              onClick={async () => {
                setIsLoading(true);
                await checkAuth();
                window.location.reload();
              }}
              className="mt-6 ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Check Status Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Organization is approved - show dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">
            Ushuari Organization
          </h1>
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
            Welcome to Your Organization Dashboard
          </h2>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-green-700">
                  Your organization has been approved! You now have full access
                  to manage cases.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Total Cases</h3>
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
          <h2 className="text-xl font-medium mb-4">Assigned Cases</h2>

          {calls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No cases assigned to your organization yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                          {call.description.substring(0, 50)}
                          {call.description.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {call.userName || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {call.userId}
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
                            href={`/organization/cases/${call.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>

                          {call.status === "pending" && (
                            <button
                              onClick={() =>
                                updateCallStatus(call.id, "in-progress")
                              }
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Start
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
