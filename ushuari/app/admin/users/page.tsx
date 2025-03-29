// app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { User } from "@/types";

// Mock data for users
const MOCK_USERS = [
  {
    id: "user-1",
    name: "Alex Williams",
    email: "alex@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "org-1",
    name: "Legal Experts LLC",
    email: "contact@legalexperts.com",
    role: "organization",
    organizationStatus: "approved",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "org-2",
    name: "Tenant Rights Group",
    email: "help@tenantrightsgroup.org",
    role: "organization",
    organizationStatus: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@ushuari.com",
    role: "admin",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, users, organizations, admins

  useEffect(() => {
    // In a real app, this would be a fetch to your API
    const fetchUsers = () => {
      setIsLoading(true);
      // Simulate API request
      setTimeout(() => {
        setUsers(MOCK_USERS);
        setIsLoading(false);
      }, 500);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "users" && user.role === "user") return true;
    if (filter === "organizations" && user.role === "organization") return true;
    if (filter === "admins" && user.role === "admin") return true;
    return false;
  });

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

  const getStatusClass = (status: string) => {
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
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
              filter === "users"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("users")}
          >
            Individual Users
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "organizations"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("organizations")}
          >
            Organizations
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "admins"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("admins")}
          >
            Admins
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Individual Users</h3>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.role === "user").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Organizations</h3>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.role === "organization").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Admins</h3>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found with the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
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
                            user.organizationStatus || "pending"
                          )}`}
                        >
                          {user.organizationStatus || "pending"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        {user.role === "organization" &&
                          user.organizationStatus === "pending" && (
                            <>
                              <button
                                onClick={() => {
                                  setUsers(
                                    users.map((u) =>
                                      u.id === user.id
                                        ? {
                                            ...u,
                                            organizationStatus: "approved",
                                          }
                                        : u
                                    )
                                  );
                                  toast.success(
                                    `${user.name} has been approved`
                                  );
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setUsers(
                                    users.map((u) =>
                                      u.id === user.id
                                        ? {
                                            ...u,
                                            organizationStatus: "rejected",
                                          }
                                        : u
                                    )
                                  );
                                  toast.success(
                                    `${user.name} has been rejected`
                                  );
                                }}
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
