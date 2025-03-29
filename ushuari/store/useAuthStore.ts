// store/useAuthStore.ts - Modified version
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { AppRouterInstance } from "next/navigation";

export type UserRole = "admin" | "organization" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationStatus?: "pending" | "approved" | "rejected";
}

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
  redirectToLogin: (router: AppRouterInstance) => void;
  ensureCorrectRoleAccess: (
    router: AppRouterInstance,
    allowedRoles: UserRole[]
  ) => Promise<boolean>;

  // Helper function that was missing
  getDashboardPath: () => string;
}

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
            console.log("Login successful:", response.data.user);
            return true;
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Login failed",
            });
            console.error("Login failed:", response.data.message);
            return false;
          }
        } catch (error: any) {
          console.error("Login error:", error);
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
            console.log("Registration successful:", response.data.user);
            return true;
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Registration failed",
            });
            console.error("Registration failed:", response.data.message);
            return false;
          }
        } catch (error: any) {
          console.error("Registration error:", error);
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
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        if (get().isAuthenticated && get().user) {
          return true;
        }

        set({ isLoading: true });
        try {
          console.log("Checking auth status...");
          // Explicitly add withCredentials: true to ensure cookies are sent
          const response = await axios.get("/api/auth/me", {
            withCredentials: true,
          });

          if (response.data.success) {
            console.log("Auth check successful:", response.data.user);
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            console.log("Auth check failed: User not authenticated");
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          console.error("Auth check error:", error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      // NEW FUNCTION: Added getDashboardPath
      getDashboardPath: () => {
        const { user } = get();
        if (!user) return "/auth/login";

        switch (user.role) {
          case "admin":
            return "/admin/dashboard";
          case "organization":
            return "/organization/dashboard";
          case "user":
          default:
            return "/dashboard";
        }
      },

      // Function to redirect to the appropriate dashboard based on user role
      redirectToDashboard: (router) => {
        const path = get().getDashboardPath();
        router.push(path);
      },

      // Function to redirect to login page
      redirectToLogin: (router) => {
        router.push("/auth/login");
      },

      // Function to ensure user has correct role access
      ensureCorrectRoleAccess: async (router, allowedRoles) => {
        // Check if user is authenticated
        const isAuth = await get().checkAuth();

        if (!isAuth) {
          console.log("Access denied: User not authenticated");
          get().redirectToLogin(router);
          return false;
        }

        const { user } = get();

        // Check if user has the allowed role
        if (user && !allowedRoles.includes(user.role)) {
          console.log(
            `Access denied: User role ${user.role} not in allowed roles:`,
            allowedRoles
          );
          // User doesn't have the allowed role, redirect to appropriate dashboard
          get().redirectToDashboard(router);
          return false;
        }

        // User is authenticated and has the correct role
        console.log(`Access granted: User role ${user?.role} is allowed`);
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
