import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { User } from "@/types";
import { authApi } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: object) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login({ email, password });
          const { user, accessToken } = res.data.data;
          Cookies.set("accessToken", accessToken, { expires: 7 });
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register(data);
          // Don't auto-login after registration - user must login manually
          // const { user, accessToken } = res.data.data;
          // Cookies.set("accessToken", accessToken, { expires: 7 });
          // set({ user, isAuthenticated: true });
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || "Registration failed. Please try again.";
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        Cookies.remove("accessToken");
        set({ user: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        try {
          const res = await authApi.me();
          set({ user: res.data.data, isAuthenticated: true });
        } catch {
          Cookies.remove("accessToken");
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "horizon-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);