// app/organization/dashboard/page.tsx - Updated version
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import Link from "next/link";
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
  const [showStatusBanner, setShowStatusBanner] = useState(true);

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
                      toast.info(
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
          </div>
        </main>
      </div>
    );
  }
}
