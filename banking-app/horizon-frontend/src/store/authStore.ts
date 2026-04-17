import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { authApi } from "@/lib/api";
import { getErrorMessage } from "@/utils/errorUtils";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: object) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, data: object) => Promise<void>;
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
          const { user } = res.data.data;
          set({ user, isAuthenticated: true });
        } catch (error: any) {
          throw new Error(getErrorMessage(error));
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register(data);
          // Don't auto-login after registration - user must login manually
        } catch (error: any) {
          throw new Error(getErrorMessage(error));
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      fetchMe: async () => {
        try {
          const res = await authApi.me();
          set({ user: res.data.data, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          await authApi.forgotPassword(email);
        } catch (error: any) {
          throw new Error(getErrorMessage(error));
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (token, data) => {
        set({ isLoading: true });
        try {
          await authApi.resetPassword(token, data);
        } catch (error: any) {
          throw new Error(getErrorMessage(error));
        } finally {
          set({ isLoading: false });
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