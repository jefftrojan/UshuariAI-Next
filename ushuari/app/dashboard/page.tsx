// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import Link from "next/link";
import CallRecorder from "@/components/CallRecorder";

// Mock data for user's calls
interface Call {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  createdAt: string;
  organizationId?: string;
  organizationName?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

const MOCK_CALLS: Call[] = [
  {
    id: "1",
    title: "Employment Contract Review",
    description: "Need help understanding my employment contract",
    status: "pending",
    createdAt: new Date().toISOString(),
    priority: "medium",
  },
  {
    id: "2",
    title: "Landlord Dispute",
    description: "My landlord is refusing to fix a leaking pipe",
    status: "in-progress",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    organizationId: "org-1",
    organizationName: "Legal Experts LLC",
    priority: "high",
  },
];

export default function UserDashboard() {
  const [calls, setCalls] = useState<Call[]>([]);
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
        if (user?.role === "admin") {
          router.push("/admin/dashboard");
        } else if (user?.role === "organization") {
          router.push("/organization/dashboard");
        }
      } else {
        // Load user's calls
        setCalls(MOCK_CALLS);
        setIsLoading(false);
      }
    };

    init();
  }, [checkAuth, router, user]);

  const handleLogout = async () => {
    const { logout } = useAuthStore.getState();
    await logout();
    router.push("/auth/login");
    toast.success("Logged out successfully");
  };

  const handleCallRecorded = async (audioBlob: Blob, transcript: string) => {
    // In a real app, you would upload the audio to your server
    // and create a new call
    console.log("Call recorded:", audioBlob, transcript);

    // Mock creating a new call
    const newCall: Call = {
      id: `new-${Date.now()}`,
      title:
        transcript.substring(0, 50) + (transcript.length > 50 ? "..." : ""),
      description: transcript,
      status: "pending",
      createdAt: new Date().toISOString(),
      priority: "medium",
    };

    setCalls((prev) => [newCall, ...prev]);
    toast.success("Your legal inquiry has been submitted!");
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
          <h1 className="text-2xl font-bold text-white">Ushuari</h1>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-100">{user?.name}</span>
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
            Welcome, {user?.name}
          </h2>
          <p className="text-white/70">
            Make calls to get legal assistance from qualified organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3 bg-gray-900/40 backdrop-blur-sm border border-green-900/20 rounded-2xl p-6 shadow-lg shadow-green-900/10">
            <CallRecorder onCallRecorded={handleCallRecorded} />
          </div>

          <div className="bg-gray-900/40 backdrop-blur-sm border border-green-900/20 rounded-2xl p-6 shadow-lg shadow-green-900/10">
            <h3 className="text-lg font-medium text-white/80 mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/70">Total Calls:</span>
                <span className="font-medium text-white">{calls.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Pending:</span>
                <span className="font-medium text-white">
                  {calls.filter((c) => c.status === "pending").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">In Progress:</span>
                <span className="font-medium text-white">
                  {calls.filter((c) => c.status === "in-progress").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Resolved:</span>
                <span className="font-medium text-white">
                  {calls.filter((c) => c.status === "resolved").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-sm border border-green-900/20 rounded-2xl p-6 shadow-lg shadow-green-900/10">
          <h2 className="text-xl font-medium text-white mb-4">Your Calls</h2>

          {calls.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              You haven't submitted any legal inquiries yet.
              <br />
              Use the call recorder above to make your first inquiry.
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
                      Title
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
                      Priority
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                    >
                      Date
                    </th>
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {calls.map((call) => (
                    <tr key={call.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {call.title}
                        </div>
                        <div className="text-sm text-white/50">
                          {call.description.substring(0, 50)}
                          {call.description.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            call.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : call.status === "in-progress"
                              ? "bg-blue-500/10 text-blue-400"
                              : call.status === "resolved"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
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
                              ? "bg-green-500/10 text-green-400"
                              : call.priority === "medium"
                              ? "bg-blue-500/10 text-blue-400"
                              : call.priority === "high"
                              ? "bg-orange-500/10 text-orange-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {call.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                        {new Date(call.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                        {call.organizationName || "Unassigned"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          View
                        </Link>
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
