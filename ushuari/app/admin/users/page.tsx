// app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "organization" | "user";
  createdAt: string;
  organizationId?: string;
  organizationStatus?: "pending" | "approved" | "rejected";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, users, organizations, admins

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Construct query URL based on filter
      let apiUrl = "/api/admin/users";
      if (filter !== "all") {
        apiUrl += `?role=${filter}`;
      }

      const response = await axios.get(apiUrl);
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        console.error("API returned error:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        // Refresh the user list to get updated data
        fetchUsers();
        toast.success(`Organization ${newStatus} successfully`);
      } else {
        toast.error(response.data.message || "Failed to update organization");
      }
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("An error occurred while updating the organization");
    }
  };

  const getRoleClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "organization":
        return "bg-green-100 text-green-800";
      case "user":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <Link
          href="/admin/dashboard"
          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Filtering options */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("all")}
          >
            All Users
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "user"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("user")}
          >
            Individual Users
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "organization"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("organization")}
          >
            Organizations
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "admin"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("admin")}
          >
            Admins
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/60 backdrop-blur-sm border border-green-900/20 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="bg-gray-900/60 backdrop-blur-sm border border-green-900/20 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Individual Users</h3>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.role === "user").length}
          </p>
        </div>
        <div className="bg-gray-900/60 backdrop-blur-sm border border-green-900/20 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Organizations</h3>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.role === "organization").length}
          </p>
        </div>
        <div className="bg-gray-900/60 backdrop-blur-sm border border-green-900/20 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Admins</h3>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-green-900/20 rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found with the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Date Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-500/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === "organization" && (
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                            user.organizationStatus
                          )}`}
                        >
                          {user.organizationStatus || "pending"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.role === "organization" && user.organizationId ? (
                          <Link
                            href={`/admin/organizations/${user.organizationId}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Organization
                          </Link>
                        ) : (
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View User
                          </Link>
                        )}

                        {user.role === "organization" &&
                          user.organizationStatus === "pending" &&
                          user.organizationId && (
                            <>
                              <button
                                onClick={() =>
                                  updateOrganizationStatus(
                                    user.organizationId as string,
                                    "approved"
                                  )
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateOrganizationStatus(
                                    user.organizationId as string,
                                    "rejected"
                                  )
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
    </div>
  );
}
