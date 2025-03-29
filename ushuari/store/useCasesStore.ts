// store/useCasesStore.ts
import { create } from "zustand";
import axios from "axios";
import { Call } from "@/types";

interface CasesState {
  calls: Call[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserCalls: () => Promise<Call[]>;
  fetchOrganizationCalls: () => Promise<Call[]>;
  fetchAllCalls: () => Promise<Call[]>;
  createCall: (callData: Partial<Call>) => Promise<Call | null>;
  updateCallStatus: (
    callId: string,
    status: Call["status"]
  ) => Promise<boolean>;
  assignCall: (callId: string, organizationId: string) => Promise<boolean>;
}

// In a real app, these would come from the API
// For now, we'll use these mock calls
const MOCK_USER_CALLS: Call[] = [
  {
    id: "1",
    title: "Employment Contract Review",
    description: "Need help understanding my employment contract",
    status: "pending",
    createdAt: new Date().toISOString(),
    userId: "user-1",
    priority: "medium",
  },
  {
    id: "2",
    title: "Landlord Dispute",
    description: "My landlord is refusing to fix a leaking pipe",
    status: "in-progress",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
    organizationId: "org-1",
    organizationName: "Legal Experts LLC",
    priority: "high",
  },
];

const MOCK_ORG_CALLS: Call[] = [
  {
    id: "101",
    title: "Employment Contract Dispute",
    description: "Employee claims unfair termination",
    status: "pending",
    createdAt: new Date().toISOString(),
    userId: "user-5",
    userName: "John Smith",
    organizationId: "org-1",
    priority: "high",
  },
  {
    id: "102",
    title: "Tenant Rights Question",
    description: "Tenant seeking advice on rental agreement",
    status: "in-progress",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-6",
    userName: "Emily Johnson",
    organizationId: "org-1",
    priority: "medium",
  },
  {
    id: "2", // This is also in the user calls to simulate the connection
    title: "Landlord Dispute",
    description: "My landlord is refusing to fix a leaking pipe",
    status: "in-progress",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
    userName: "Alex Williams",
    organizationId: "org-1",
    priority: "high",
  },
];

export const useCasesStore = create<CasesState>()((set, get) => ({
  calls: [],
  isLoading: false,
  error: null,

  fetchUserCalls: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, we would call the API
      // const response = await axios.get('/api/calls/user');
      // const calls = response.data.calls;

      // For now, use mock data
      const calls = MOCK_USER_CALLS;

      set({ calls, isLoading: false });
      return calls;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch calls",
      });
      return [];
    }
  },

  fetchOrganizationCalls: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, we would call the API
      // const response = await axios.get('/api/calls/organization');
      // const calls = response.data.calls;

      // For now, use mock data
      const calls = MOCK_ORG_CALLS;

      set({ calls, isLoading: false });
      return calls;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch calls",
      });
      return [];
    }
  },

  fetchAllCalls: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, we would call the API
      // const response = await axios.get('/api/calls/all');
      // const calls = response.data.calls;

      // For now, use mock data
      const calls = [...MOCK_USER_CALLS, ...MOCK_ORG_CALLS];

      set({ calls, isLoading: false });
      return calls;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch calls",
      });
      return [];
    }
  },

  createCall: async (callData) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, we would call the API
      // const response = await axios.post('/api/calls', callData);
      // const newCall = response.data.call;

      // For now, create a mock call
      const newCall: Call = {
        id: `new-${Date.now()}`,
        title: callData.title || "Untitled Call",
        description: callData.description || "",
        status: "pending",
        createdAt: new Date().toISOString(),
        userId: callData.userId || "user-1",
        priority: callData.priority || "medium",
      };

      set((state) => ({
        calls: [newCall, ...state.calls],
        isLoading: false,
      }));

      return newCall;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create call",
      });
      return null;
    }
  },

  updateCallStatus: async (callId, status) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, we would call the API
      // const response = await axios.patch(`/api/calls/${callId}`, { status });
      // const success = response.data.success;

      // For now, update locally
      set((state) => ({
        calls: state.calls.map((call) =>
          call.id === callId ? { ...call, status } : call
        ),
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update call",
      });
      return false;
    }
  },

  assignCall: async (callId, organizationId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, we would call the API
      // const response = await axios.patch(`/api/calls/${callId}/assign`, { organizationId });
      // const success = response.data.success;

      // For now, update locally
      set((state) => ({
        calls: state.calls.map((call) =>
          call.id === callId ? { ...call, organizationId } : call
        ),
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to assign call",
      });
      return false;
    }
  },
}));
