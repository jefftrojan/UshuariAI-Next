// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { AppRouterInstance } from "next/navigation";

// Define user roles
export type UserRole = "admin" | "organization" | "user";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationStatus?: "pending" | "approved" | "rejected";
}

// Auth state interface
interface AuthState {
  user: User | null;
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
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;

  // Navigation helpers
  redirectToDashboard: (router: AppRouterInstance) => void;
  ensureCorrectRoleAccess: (
    router: AppRouterInstance,
    allowedRoles: UserRole[]
  ) => Promise<boolean>;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post("/api/auth/login", {
            email,
            password,
          });

          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Login failed",
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Login failed",
          });
          return false;
        }
      },

      register: async (name, email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post("/api/auth/register", {
            name,
            email,
            password,
            role,
          });

          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Registration failed",
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Registration failed",
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await axios.post("/api/auth/logout");
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },

      checkAuth: async () => {
        if (get().isAuthenticated && get().user) {
          return true;
        }

        set({ isLoading: true });
        try {
          const response = await axios.get("/api/auth/me");

          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      // Function to redirect to the appropriate dashboard based on user role
      redirectToDashboard: (router) => {
        const { user } = get();
        if (!user) return;

        switch (user.role) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "organization":
            router.push("/organization/dashboard");
            break;
          case "user":
          default:
            router.push("/dashboard");
            break;
        }
      },

      // Function to ensure user has correct role access
      ensureCorrectRoleAccess: async (router, allowedRoles) => {
        // Check if user is authenticated
        const isAuth = await get().checkAuth();

        if (!isAuth) {
          router.push("/auth/login");
          return false;
        }

        const { user } = get();

        // Check if user has the allowed role
        if (user && !allowedRoles.includes(user.role)) {
          get().redirectToDashboard(router);
          return false;
        }

        // User is authenticated and has the correct role
        return true;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
