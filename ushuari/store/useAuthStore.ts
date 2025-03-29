// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export type UserRole = "admin" | "organization" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
        await axios.post("/api/auth/logout");
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
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
