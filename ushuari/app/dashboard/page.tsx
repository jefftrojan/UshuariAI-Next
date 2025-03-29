"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import VoiceRecorder from "@/components/common/VoiceRecorder";
import { toast } from "react-hot-toast";
import { Case } from "@/types/index";

// Mock data for user's cases
const MOCK_CASES: Case[] = [
  {
    id: "1",
    title: "Employment Contract Review",
    description: "Need help understanding my employment contract",
    status: "pending",
    createdAt: new Date().toISOString(),
    userId: "3",
    priority: "medium",
  },
  {
    id: "2",
    title: "Landlord Dispute",
    description: "My landlord is refusing to fix a leaking pipe",
    status: "in-progress",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "3",
    organizationId: "org-1",
    priority: "high",
  },
];

export default function UserDashboard() {
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
      } else if (user?.role !== "user") {
        // Redirect to appropriate dashboard based on role
        if (user?.role === "admin") {
          router.push("/admin/dashboard");
        } else if (user?.role === "organization") {
          router.push("/organization/dashboard");
        }
      } else {
        // Load user's cases
        setCases(MOCK_CASES);
        setIsLoading(false);
      }
    };

    init();
  }, [checkAuth, router, user]);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    // In a real app, you would upload the audio to your server
    // and create a new case
    console.log("Recording completed:", audioBlob);

    // Mock creating a new case
    const newCase: Case = {
      id: `new-${Date.now()}`,
      title: "New Voice Inquiry",
      description: "This is a new voice inquiry that was just recorded.",
      status: "pending",
      createdAt: new Date().toISOString(),
      userId: user?.id || "",
      priority: "medium",
      audioUrl: URL.createObjectURL(audioBlob),
    };

    setCases((prev) => [newCase, ...prev]);
    toast.success("Your inquiry has been submitted!");
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
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Your Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cases:</span>
              <span className="font-medium">{cases.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending:</span>
              <span className="font-medium">
                {cases.filter((c) => c.status === "pending").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress:</span>
              <span className="font-medium">
                {cases.filter((c) => c.status === "in-progress").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Resolved:</span>
              <span className="font-medium">
                {cases.filter((c) => c.status === "resolved").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-medium mb-4">Your Cases</h2>

        {cases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            You haven't submitted any legal inquiries yet.
            <br />
            Use the voice recorder above to make your first inquiry.
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          caseItem.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : caseItem.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
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
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </a>
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
