// store/useAuthStore.ts (updated)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Define user roles
export type UserRole = "admin" | "organization" | "user";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationId?: string;
  organizationStatus?: "pending" | "approved" | "rejected";
}

// Auth store interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

// Create the auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post("/api/auth/login", {
            email,
            password,
          });

          if (response.status === 200 && response.data.success) {
            const { user, token } = response.data;
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Login failed.",
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Login failed.",
          });
          return false;
        }
      },

      // Register action
      register: async (name, email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post("/api/auth/register", {
            name,
            email,
            password,
            role,
          });

          if (response.status === 201 && response.data.success) {
            const { user, token } = response.data;
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Registration failed.",
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Registration failed.",
          });
          return false;
        }
      },

      // Logout action
      logout: () => {
        // Clear auth data
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });

        // Clear the cookie by making a request to logout endpoint
        // This is optional but good practice
        axios
          .post("/api/auth/logout")
          .catch((err) => console.error("Logout error:", err));
      },

      // Check auth status
      checkAuth: async () => {
        // Skip if already authenticated
        if (get().isAuthenticated && get().user) {
          return true;
        }

        set({ isLoading: true });

        try {
          const response = await axios.get("/api/auth/me");

          if (response.status === 200 && response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
