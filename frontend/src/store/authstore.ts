import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthState } from '@/types';
import { api } from '@/lib/api';

interface AuthActions {
  loginUser: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoadingAuth: false,

      // Actions
      loginUser: async (email: string, password: string) => {
        set({ isLoadingAuth: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, accessToken, refreshToken } = response.data.data;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoadingAuth: false,
          });
        } catch (error) {
          set({ isLoadingAuth: false });
          throw error;
        }
      },

      register: async (data: any) => {
        set({ isLoadingAuth: true });
        try {
          const response = await api.post('/auth/register', data);
          const { user, accessToken, refreshToken } = response.data.data;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoadingAuth: false,
          });
        } catch (error) {
          set({ isLoadingAuth: false });
          throw error;
        }
      },

      logout: () => {
        // Call logout API endpoint
        api.post('/auth/logout').catch(console.error);

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAuthToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

          set({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          // If refresh fails, logout
          get().logout();
          throw error;
        }
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      forgotPassword: async (email: string) => {
        set({ isLoadingAuth: true });
        try {
          await api.post('/auth/forgot-password', { email });
          set({ isLoadingAuth: false });
        } catch (error) {
          set({ isLoadingAuth: false });
          throw error;
        }
      },

      resetPassword: async (password: string, token: string) => {
        set({ isLoadingAuth: true });
        try {
          await api.post(`/auth/reset-password/${token}`, { password });
          set({ isLoadingAuth: false });
        } catch (error) {
          set({ isLoadingAuth: false });
          throw error;
        }
      },

      verifyEmail: async (token: string) => {
        set({ isLoadingAuth: true });
        try {
          const response = await api.post(`/auth/verify-email/${token}`);
          const { user, accessToken, refreshToken } = response.data.data;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoadingAuth: false,
          });
        } catch (error) {
          set({ isLoadingAuth: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
