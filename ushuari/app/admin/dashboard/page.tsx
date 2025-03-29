"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import Link from "next/link";
import axios from "axios";

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

interface AdminNotification {
  id: string;
  type: string;
  organizationId: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
}

export default function AdminDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { user, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push("/auth/login");
      } else if (user?.role !== "admin") {
        if (user?.role === "organization") {
          router.push("/organization/dashboard");
        } else if (user?.role === "user") {
          router.push("/dashboard");
        }
      } else {
        await fetchData();
        setIsLoading(false);
      }
    };

    init();
  }, [checkAuth, router, user]);

  const fetchData = async () => {
    try {
      const orgResponse = await axios.get("/api/admin/organizations");
      if (orgResponse.data.success) {
        setOrganizations(orgResponse.data.organizations);
      }

      const notifyResponse = await axios.get(
        "/api/admin/notifications?status=unread"
      );
      if (notifyResponse.data.success) {
        setNotifications(notifyResponse.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setOrganizations([
        {
          id: "org-1",
          name: "Legal Experts LLC",
          email: "contact@legalexperts.com",
          description: "Specializing in employment and contract law",
          status: "approved",
          createdAt: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          contactPerson: "Jane Smith",
          specialties: ["Employment Law", "Contract Law"],
        },
        {
          id: "org-2",
          name: "Tenant Rights Group",
          email: "help@tenantrightsgroup.org",
          description: "Advocating for tenant rights and housing issues",
          status: "pending",
          createdAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          contactPerson: "Michael Johnson",
          specialties: ["Housing Law", "Tenant Rights"],
        },
      ]);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
    toast.success("Logged out successfully");
  };

  const updateOrganizationStatus = async (
    orgId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const response = await axios.post(
        `/api/admin/organizations/${orgId}/approve`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === orgId ? { ...org, status: newStatus } : org
          )
        );
        await fetchData();
        toast.success(`Organization ${newStatus}`);
      } else {
        toast.error(response.data.message || "Failed to update organization");
      }
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("An error occurred while updating the organization");
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === orgId ? { ...org, status: newStatus } : org
        )
      );
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await axios.post(`/api/admin/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-green-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
            Ushuari Admin
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-white/80">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Admin Dashboard
          </h2>
          <p className="text-white/70">
            Manage organizations, users, and platform settings.
          </p>
        </div>

        {/* Admin Notifications */}
        {notifications.length > 0 && (
          <div className="mb-8 bg-blue-900/20 backdrop-blur-sm border border-blue-900/30 rounded-xl p-4">
            <h3 className="text-lg font-medium text-blue-400 mb-2">
              Notifications
            </h3>
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md border border-gray-800"
                >
                  <div>
                    <p className="text-white">{notification.message}</p>
                    <p className="text-xs text-white/50">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {notification.type === "new_organization" && (
                      <Link
                        href={`/admin/organizations?highlight=${notification.organizationId}`}
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        View
                      </Link>
                    )}
                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/60 backdrop-blur-sm border border-green-900/20 rounded-xl p-6 hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300">
            <h3 className="text-lg font-medium text-white/80 mb-4">Total Organizations</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
              {organizations.length}
            </p>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-sm border border-yellow-900/20 rounded-xl p-6 hover:shadow-lg hover:shadow-yellow-900/10 transition-all duration-300">
            <h3 className="text-lg font-medium text-white/80 mb-4">Pending Approval</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 text-transparent bg-clip-text">
              {organizations.filter((org) => org.status === "pending").length}
            </p>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-sm border border-emerald-900/20 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-900/10 transition-all duration-300">
            <h3 className="text-lg font-medium text-white/80 mb-4">Approved</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-600 text-transparent bg-clip-text">
              {organizations.filter((org) => org.status === "approved").length}
            </p>
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-sm border border-green-900/20 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-green-900/20 flex justify-between items-center">
            <h2 className="text-xl font-medium text-white">Organizations</h2>
            <div className="flex space-x-2">
              <Link
                href="/admin/users"
                className="px-4 py-2 bg-gray-800/70 hover:bg-gray-800 text-white rounded-md border border-gray-700 transition-colors"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/calls"
                className="px-4 py-2 bg-gray-800/70 hover:bg-gray-800 text-white rounded-md border border-gray-700 transition-colors"
              >
                View All Calls
              </Link>
            </div>
          </div>

          {organizations.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              No organizations found.
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
                      Organization
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                    >
                      Contact
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
                      Date Joined
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
                  {organizations.map((org) => (
                    <tr key={org.id} className="hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {org.name}
                        </div>
                        <div className="text-sm text-white/60">
                          {org.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {org.contactPerson}
                        </div>
                        <div className="text-sm text-white/60">{org.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            org.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : org.status === "approved"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/admin/organizations/${org.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            View
                          </Link>
                          {org.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateOrganizationStatus(org.id, "approved")
                                }
                                className="text-green-400 hover:text-green-300 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateOrganizationStatus(org.id, "rejected")
                                }
                                className="text-red-400 hover:text-red-300 transition-colors"
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