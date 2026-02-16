import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authstore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await useAuthStore.getState().refreshAuthToken();

        // Retry the original request with new token
        const { accessToken } = useAuthStore.getState();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        useAuthStore.getState().logout();

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelpers = {
  // Authentication
  auth: {
    login: (email: string, password: string) =>
      api.post('/auth/login', { email, password }),
    register: (data: any) =>
      api.post('/auth/register', data),
    logout: () =>
      api.post('/auth/logout'),
    refreshToken: (refreshToken: string) =>
      api.post('/auth/refresh', { refreshToken }),
    forgotPassword: (email: string) =>
      api.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) =>
      api.post('/auth/reset-password', { token, password }),
    verifyEmail: (token: string) =>
      api.post('/auth/verify-email', { token }),
  },

  // Users
  users: {
    getProfile: () =>
      api.get('/users/profile'),
    updateProfile: (data: any) =>
      api.put('/users/profile', data),
    uploadAvatar: (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    changePassword: (currentPassword: string, newPassword: string) =>
      api.post('/users/change-password', { currentPassword, newPassword }),
    getSettings: () =>
      api.get('/users/settings'),
    updateSettings: (settings: any) =>
      api.put('/users/settings', settings),
  },

  // Therapists
  therapists: {
    getAll: (params?: any) =>
      api.get('/therapists', { params }),
    getById: (id: string) =>
      api.get(`/therapists/${id}`),
    search: (query: string, filters?: any) =>
      api.get('/therapists/search', { params: { query, ...filters } }),
    getAvailability: (id: string, date: string) =>
      api.get(`/therapists/${id}/availability`, { params: { date } }),
  },

  // Sessions
  sessions: {
    getAll: (params?: any) =>
      api.get('/sessions', { params }),
    getById: (id: string) =>
      api.get(`/sessions/${id}`),
    create: (data: any) =>
      api.post('/sessions', data),
    update: (id: string, data: any) =>
      api.put(`/sessions/${id}`, data),
    cancel: (id: string, reason?: string) =>
      api.post(`/sessions/${id}/cancel`, { reason }),
    rate: (id: string, rating: number, feedback?: string) =>
      api.post(`/sessions/${id}/rate`, { rating, feedback }),
  },

  // Bookings
  bookings: {
    create: (data: any) =>
      api.post('/bookings', data),
    getAll: (params?: any) =>
      api.get('/bookings', { params }),
    getById: (id: string) =>
      api.get(`/bookings/${id}`),
    cancel: (id: string, reason?: string) =>
      api.post(`/bookings/${id}/cancel`, { reason }),
    reschedule: (id: string, newDate: string, newTime: string) =>
      api.post(`/bookings/${id}/reschedule`, { newDate, newTime }),
  },

  // Chat
  chat: {
    getSessions: () =>
      api.get('/chat/sessions'),
    createSession: (type: string, participantId?: string) =>
      api.post('/chat/sessions', { type, participantId }),
    getMessages: (sessionId: string, params?: any) =>
      api.get(`/chat/sessions/${sessionId}/messages`, { params }),
    sendMessage: (sessionId: string, content: string, type?: string) =>
      api.post(`/chat/sessions/${sessionId}/messages`, { content, type }),
    uploadFile: (sessionId: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post(`/chat/sessions/${sessionId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    markAsRead: (sessionId: string) =>
      api.post(`/chat/sessions/${sessionId}/read`),
  },

  // Payments
  payments: {
    getAll: (params?: any) =>
      api.get('/payments', { params }),
    createIntent: (amount: number, sessionId?: string) =>
      api.post('/payments/intent', { amount, sessionId }),
    confirmPayment: (paymentIntentId: string) =>
      api.post('/payments/confirm', { paymentIntentId }),
    getPaymentMethods: () =>
      api.get('/payments/methods'),
    addPaymentMethod: (paymentMethodId: string) =>
      api.post('/payments/methods', { paymentMethodId }),
    removePaymentMethod: (id: string) =>
      api.delete(`/payments/methods/${id}`),
    setDefaultPaymentMethod: (id: string) =>
      api.post(`/payments/methods/${id}/default`),
  },

  // Support
  support: {
    getTickets: (params?: any) =>
      api.get('/support/tickets', { params }),
    createTicket: (data: any) =>
      api.post('/support/tickets', data),
    getTicket: (id: string) =>
      api.get(`/support/tickets/${id}`),
    replyToTicket: (id: string, content: string, attachments?: File[]) => {
      const formData = new FormData();
      formData.append('content', content);
      attachments?.forEach((file) => formData.append('attachments', file));
      return api.post(`/support/tickets/${id}/reply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    closeTicket: (id: string) =>
      api.post(`/support/tickets/${id}/close`),
  },

  // Notifications
  notifications: {
    getAll: (params?: any) =>
      api.get('/notifications', { params }),
    markAsRead: (id: string) =>
      api.post(`/notifications/${id}/read`),
    markAllAsRead: () =>
      api.post('/notifications/read-all'),
    delete: (id: string) =>
      api.delete(`/notifications/${id}`),
  },

  // Analytics
  analytics: {
    getUserProgress: () =>
      api.get('/analytics/progress'),
    getMoodTrends: (startDate?: string, endDate?: string) =>
      api.get('/analytics/mood', { params: { startDate, endDate } }),
    logMood: (mood: number, energy: number, anxiety: number, notes?: string) =>
      api.post('/analytics/mood', { mood, energy, anxiety, notes }),
  },
};

export default api;
