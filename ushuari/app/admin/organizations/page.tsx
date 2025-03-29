// app/admin/organizations/page.tsx - Enhanced version
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Organization } from "@/types";
import axios from "axios";

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the highlighted organization from query params
  const highlightedOrgId = searchParams.get("highlight");

  useEffect(() => {
    const fetchOrganizations = async () => {
      setIsLoading(true);
      try {
        // Construct query based on filter
        let apiUrl = "/api/admin/organizations";
        if (filter !== "all") {
          apiUrl += `?status=${filter}`;
        }

        const response = await axios.get(apiUrl);

        if (response.data.success) {
          setOrganizations(response.data.organizations);

          // If there's a highlighted organization, scroll to it
          if (highlightedOrgId) {
            setTimeout(() => {
              const element = document.getElementById(
                `org-${highlightedOrgId}`
              );
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                element.classList.add("bg-yellow-50");
                // Remove highlight after 3 seconds
                setTimeout(() => {
                  element.classList.remove("bg-yellow-50");
                }, 3000);
              }
            }, 500);
          }
        } else {
          toast.error("Failed to fetch organizations");
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        toast.error("An error occurred while fetching organizations");

        // Fallback to mock data in case of API failure
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [filter, highlightedOrgId]);

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
        // Update the organization locally
        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === orgId ? { ...org, status: newStatus } : org
          )
        );

        const orgName =
          organizations.find((org) => org.id === orgId)?.name || "Organization";
        toast.success(`${orgName} ${newStatus} successfully`);
      } else {
        toast.error(
          response.data.message || "Failed to update organization status"
        );
      }
    } catch (error) {
      console.error("Error updating organization status:", error);
      toast.error("An error occurred while updating the organization");

      // Optimistically update UI even if API fails
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === orgId ? { ...org, status: newStatus } : org
        )
      );
    }
  };

  const filteredOrganizations = organizations.filter((org) => {
    if (filter === "all") return true;
    return org.status === filter;
  });

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Organizations</h1>
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
            All Organizations
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending Approval
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "approved"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("approved")}
          >
            Approved
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filter === "rejected"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Total</h3>
          <p className="text-3xl font-bold">{organizations.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {organizations.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-500">
            {organizations.filter((o) => o.status === "approved").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-500">
            {organizations.filter((o) => o.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading organizations...</p>
          </div>
        ) : filteredOrganizations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No organizations found with the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrganizations.map((org) => (
                  <tr
                    key={org.id}
                    id={`org-${org.id}`}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {org.name}
                      </div>
                      <div className="text-sm text-gray-500">{org.email}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {org.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {org.contactPerson}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
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
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {org.specialties?.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
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
                        {org.status === "rejected" && (
                          <button
                            onClick={() =>
                              updateOrganizationStatus(org.id, "approved")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Reconsider
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
