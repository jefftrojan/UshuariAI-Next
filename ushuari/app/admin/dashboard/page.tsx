// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
  email: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  contactPerson: string;
  specialties?: string[];
}

// Mock data for organizations
const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org-1",
    name: "Legal Experts LLC",
    email: "contact@legalexperts.com",
    description: "Specializing in employment and contract law",
    status: "approved",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    contactPerson: "Jane Smith",
    specialties: ["Employment Law", "Contract Law"],
  },
  {
    id: "org-2",
    name: "Tenant Rights Group",
    email: "help@tenantrightsgroup.org",
    description: "Advocating for tenant rights and housing issues",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    contactPerson: "Michael Johnson",
    specialties: ["Housing Law", "Tenant Rights"],
  },
  {
    id: "org-3",
    name: "Family Law Partners",
    email: "info@familylawpartners.com",
    description: "Legal assistance with family law matters",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    contactPerson: "Robert Wilson",
    specialties: ["Family Law", "Divorce", "Child Custody"],
  },
];

export default function AdminDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { user, checkAuth, logout } = useAuthStore();

  // Check authentication on load
  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push("/auth/login");
      } else if (user?.role !== "admin") {
        // Redirect to appropriate dashboard based on role
        if (user?.role === "organization") {
          router.push("/organization/dashboard");
        } else if (user?.role === "user") {
          router.push("/dashboard");
        }
      } else {
        // Load organizations
        setOrganizations(MOCK_ORGANIZATIONS);
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

  const updateOrganizationStatus = (
    orgId: string,
    newStatus: "approved" | "rejected"
  ) => {
    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === orgId ? { ...org, status: newStatus } : org
      )
    );
    toast.success(`Organization ${newStatus}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">Ushuari Admin</h1>
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
            Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Manage organizations, users, and platform settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Total Organizations</h3>
            <p className="text-3xl font-bold text-blue-600">
              {organizations.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Pending Approval</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {organizations.filter((org) => org.status === "pending").length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Approved</h3>
            <p className="text-3xl font-bold text-green-500">
              {organizations.filter((org) => org.status === "approved").length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Organizations</h2>
            <div className="flex space-x-2">
              <Link
                href="/admin/users"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/calls"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                View All Calls
              </Link>
            </div>
          </div>

          {organizations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No organizations found.
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
                      Organization
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
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
                      Date Joined
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
                  {organizations.map((org) => (
                    <tr key={org.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {org.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {org.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {org.contactPerson}
                        </div>
                        <div className="text-sm text-gray-500">{org.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            org.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : org.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/organizations/${org.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          {org.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateOrganizationStatus(org.id, "approved")
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateOrganizationStatus(org.id, "rejected")
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
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
