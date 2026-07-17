import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { User, AuthState } from '@/types';
import { api } from '@/lib/api';
import { normalizeUser } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface AuthActions {
  loginUser: (email: string, password: string) => Promise<User>;
  register: (data: Record<string, unknown>) => Promise<User>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  fetchCurrentUser: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoadingAuth: false,

      loginUser: async (email: string, password: string) => {
        set({ isLoadingAuth: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, accessToken, refreshToken } = response.data.data;
          const normalized = normalizeUser(user)!;

          set({
            user: normalized,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoadingAuth: false,
          });
          return normalized;
        } catch (error) {
          set({ isLoadingAuth: false });
          throw error;
        }
      },

      register: async (data: Record<string, unknown>) => {
        set({ isLoadingAuth: true });
        try {
          const payload = {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth,
          };
          const response = await api.post('/auth/register', payload);
          const { user, accessToken, refreshToken } = response.data.data;
          const normalized = normalizeUser(user)!;

          set({
            user: normalized,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoadingAuth: false,
          });
          return normalized;
        } catch (error) {
          set({ isLoadingAuth: false });
          throw error;
        }
      },

      logout: () => {
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
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        set({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      },

      fetchCurrentUser: async () => {
        try {
          const response = await api.get('/users/me');
          const normalized = normalizeUser(response.data.data);
          if (normalized) set({ user: normalized, isAuthenticated: true });
          return normalized;
        } catch {
          return null;
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
          await api.post('/auth/reset-password', { token, newPassword: password });
          set({ isLoadingAuth: false });
        } catch (error) {
          set({ isLoadingAuth: false });
          throw error;
        }
      },

      verifyEmail: async (token: string) => {
        set({ isLoadingAuth: true });
        try {
          await api.post('/auth/verify-email', { token });
          set({ isLoadingAuth: false });
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
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          const normalized = normalizeUser(state.user as unknown as Record<string, unknown>);
          if (normalized) state.user = normalized;
        }
      },
    }
  )
);
