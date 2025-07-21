// app/admin/organizations/[id]/page.tsx - Enhanced version
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Organization } from "@/types";
import axios from "axios";

export default function OrganizationDetailPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchOrganization = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/admin/organizations/${id}`
        );

        if (response.data.success) {
          setOrganization(response.data.organization);
        } else {
          toast.error(
            response.data.message || "Failed to fetch organization details"
          );
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast.error("An error occurred while fetching organization details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  const updateOrganizationStatus = async (
    newStatus: "approved" | "rejected"
  ) => {
    if (!organization) return;

    try {
      const response = await axios.post(
        `/api/admin/organizations/${id}/approve`,
        {
          status: newStatus,
          notes: notes.trim() || undefined,
        }
      );

      if (response.data.success) {
        setOrganization({ ...organization, status: newStatus });
        toast.success(`${organization.name} ${newStatus} successfully`);

        // Clear notes after successful update
        setNotes("");

        // Create notification for the organization
        try {
          await axios.post("/api/notifications/organization-status", {
            organizationId: id,
            status: newStatus,
            message:
              newStatus === "approved"
                ? "Your organization has been approved! You can now receive and handle legal assistance calls."
                : "Your organization registration has been rejected. Please contact support for more information.",
          });
        } catch (notifyError) {
          console.error(
            "Error sending organization notification:",
            notifyError
          );
          // Non-critical error, don't show to the user
        }
      } else {
        toast.error(
          response.data.message || "Failed to update organization status"
        );
      }
    } catch (error) {
      console.error("Error updating organization status:", error);
      toast.error("An error occurred while updating the organization");

      // Still update UI optimistically
      setOrganization({ ...organization, status: newStatus });
    }
  };

  // If organization not found
  if (!isLoading && !organization) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Organization Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The organization you are looking for does not exist or has been
            removed.
          </p>
          <Link
            href="/admin/organizations"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Organizations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Organization Details</h1>
        <div className="flex space-x-2">
          <Link
            href="/admin/organizations"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to Organizations
          </Link>
          <Link
            href="/admin/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading organization details...</p>
        </div>
      ) : (
        organization && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Organization Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {organization.name}
                  </h2>
                  <p className="text-gray-600 mt-1">{organization.email}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    organization.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : organization.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {organization.status.charAt(0).toUpperCase() +
                    organization.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Organization Details */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Organization Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Contact Person
                    </p>
                    <p className="mt-1">{organization.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date Joined
                    </p>
                    <p className="mt-1">
                      {new Date(organization.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Specialties
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {organization.specialties?.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {organization.description}
                </p>
              </div>
            </div>

            {/* Approval Section */}
            {organization.status === "pending" && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Organization Approval
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Admin Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add notes about this organization approval decision..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateOrganizationStatus("approved")}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Approve Organization
                  </button>
                  <button
                    onClick={() => updateOrganizationStatus("rejected")}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject Organization
                  </button>
                </div>
              </div>
            )}

            {/* Status Change Section for Already Approved/Rejected */}
            {organization.status !== "pending" && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Change Status</h3>
                <div className="mb-4">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Admin Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add notes about this status change..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex space-x-4">
                  {organization.status === "rejected" && (
                    <button
                      onClick={() => updateOrganizationStatus("approved")}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Approve Organization
                    </button>
                  )}
                  {organization.status === "approved" && (
                    <button
                      onClick={() => updateOrganizationStatus("rejected")}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Revoke Approval
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
