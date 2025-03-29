"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import { Case } from "@/types/index";

// Mock data for organization's cases
const MOCK_ORG_CASES: Case[] = [
  {
    id: "101",
    title: "Employment Contract Dispute",
    description: "Employee claims unfair termination",
    status: "pending",
    createdAt: new Date().toISOString(),
    userId: "5",
    organizationId: "org-1",
    priority: "high",
  },
  {
    id: "102",
    title: "Tenant Rights Question",
    description: "Tenant seeking advice on rental agreement",
    status: "in-progress",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "6",
    organizationId: "org-1",
    priority: "medium",
  },
  {
    id: "2", // This is also in the user dashboard to simulate the connection
    title: "Landlord Dispute",
    description: "My landlord is refusing to fix a leaking pipe",
    status: "in-progress",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "3",
    organizationId: "org-1",
    priority: "high",
  },
];

export default function OrganizationDashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

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
        // Load organization's cases
        setCases(MOCK_ORG_CASES);
        setIsLoading(false);
      }
    };

    init();
  }, [checkAuth, router, user]);

  const updateCaseStatus = (
    caseId: string,
    newStatus: "pending" | "in-progress" | "resolved" | "rejected"
  ) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
    toast.success(`Case status updated to ${newStatus}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Organization Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Total Cases</h3>
          <p className="text-3xl font-bold text-indigo-600">{cases.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {cases.filter((c) => c.status === "pending").length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">In Progress</h3>
          <p className="text-3xl font-bold text-blue-500">
            {cases.filter((c) => c.status === "in-progress").length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Resolved</h3>
          <p className="text-3xl font-bold text-green-500">
            {cases.filter((c) => c.status === "resolved").length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Assigned Cases</h2>
          <button
            onClick={() => router.push("/organization/cases")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View All Cases
          </button>
        </div>

        {cases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No cases have been assigned to your organization yet.
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
                {cases.map((caseItem) => (
                  <tr key={caseItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {caseItem.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {caseItem.description.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          caseItem.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : caseItem.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : caseItem.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          caseItem.priority === "low"
                            ? "bg-green-100 text-green-800"
                            : caseItem.priority === "medium"
                            ? "bg-blue-100 text-blue-800"
                            : caseItem.priority === "high"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {caseItem.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(caseItem.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/organization/cases/${caseItem.id}`)
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        {caseItem.status === "pending" && (
                          <button
                            onClick={() =>
                              updateCaseStatus(caseItem.id, "in-progress")
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Accept
                          </button>
                        )}
                        {caseItem.status === "in-progress" && (
                          <button
                            onClick={() =>
                              updateCaseStatus(caseItem.id, "resolved")
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
    </div>
  );
}
