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
    const url = originalRequest?.url ?? '';

    if (url.includes('/auth/refresh') || url.includes('/auth/login')) {
      return Promise.reject(error);
    }

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
    resetPassword: (token: string, newPassword: string) =>
      api.post('/auth/reset-password', { token, newPassword }),
    verifyEmail: (token: string) =>
      api.post('/auth/verify-email', { token }),
    sendVerification: () =>
      api.post('/auth/send-verification'),
    getStatus: () =>
      api.get('/auth/status'),
  },

  // Users
  users: {
    getProfile: () =>
      api.get('/users/me'),
    updateProfile: (data: any) =>
      api.patch('/users/me', data),
    uploadAvatar: (pictureUrl: string) =>
      api.post('/users/me/profile-picture', { pictureUrl }),
    changePassword: (currentPassword: string, newPassword: string) =>
      api.post('/auth/change-password', { currentPassword, newPassword }),
    getSettings: () =>
      api.get('/users/me'),
    updateSettings: (settings: any) =>
      api.patch('/users/me/preferences', settings),
    getStats: () =>
      api.get('/users/me/stats'),
    deactivateAccount: () =>
      api.post('/users/me/deactivate'),
    deleteAccount: () =>
      api.delete('/users/me'),
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
    createAI: () =>
      api.post('/sessions/ai'),
    createTherapist: (data: any) =>
      api.post('/sessions/therapist', data),
    getMine: (params?: any) =>
      api.get('/sessions/mine', { params }),
    getById: (id: string) =>
      api.get(`/sessions/${id}`),
    getMessages: (sessionId: string, params?: any) =>
      api.get(`/sessions/${sessionId}/messages`, { params }),
    addNotes: (sessionId: string, notes: string) =>
      api.post(`/sessions/${sessionId}/notes`, { notes }),
    getSummary: (sessionId: string) =>
      api.get(`/sessions/${sessionId}/summary`),
    getTranscript: (sessionId: string) =>
      api.get(`/sessions/${sessionId}/transcript`),
    end: (sessionId: string) =>
      api.patch(`/sessions/${sessionId}/end`),
    cancel: (sessionId: string, reason?: string) =>
      api.delete(`/sessions/${sessionId}`, { data: { reason } }),
  },

  // AI
  ai: {
    guestChat: (data: any) =>
      api.post('/ai/guest/chat', data),
    startChat: () =>
      api.post('/ai/chat/start'),
    sendChatMessage: (data: any) =>
      api.post('/ai/chat/message', data),
    endChat: (data: any) =>
      api.post('/ai/chat/end', data),
    getSessionMessages: (sessionId: string) =>
      api.get(`/ai/sessions/${sessionId}/messages`),
    getCopingStrategies: (data: any) =>
      api.post('/ai/coping-strategies', data),
  },

  // Bookings
  bookings: {
    create: (data: any) =>
      api.post('/bookings', data),
    getAll: (params?: any) =>
      api.get('/bookings', { params }),
    getMine: (params?: any) =>
      api.get('/bookings/my-bookings', { params }),
    getById: (id: string) =>
      api.get(`/bookings/${id}`),
    cancel: (id: string, reason?: string) =>
      api.post(`/bookings/${id}/cancel`, { reason }),
    reschedule: (id: string, scheduledAt: string) =>
      api.post(`/bookings/${id}/reschedule`, { scheduledAt }),
    getAvailableSlots: (therapistId: string, date: string, duration?: number) =>
      api.get('/bookings/available-slots', { params: { therapistId, date, duration } }),
    startSession: (id: string) =>
      api.post(`/bookings/${id}/start`),
    endSession: (id: string) =>
      api.post(`/bookings/${id}/end`),
  },

  // Chat
  chat: {
    sendMessage: (sessionId: string, content: string, contentType: string = 'text', fileUrl?: string) =>
      api.post('/chat/send', { sessionId, content, contentType, fileUrl }),
    getHistory: (sessionId: string, params?: any) =>
      api.get(`/chat/${sessionId}/history`, { params }),
    editMessage: (id: string, content: string) =>
      api.patch(`/chat/messages/${id}`, { content }),
    deleteMessage: (id: string) =>
      api.delete(`/chat/messages/${id}`),
    markAsRead: (sessionId: string) =>
      api.patch(`/chat/${sessionId}/read`),
    getUnreadCount: (sessionId: string) =>
      api.get(`/chat/${sessionId}/unread`),
  },

  // Video
  video: {
    createRoom: (data: any) =>
      api.post('/video/room/create', data),
    getToken: (id: string) =>
      api.get(`/video/room/${id}/token`),
    endRoom: (id: string) =>
      api.delete(`/video/room/${id}`),
    getParticipants: (id: string) =>
      api.get(`/video/room/${id}/participants`),
    initiateVoiceCall: (data: any) =>
      api.post('/video/voice/call/initiate', data),
  },

  // Payments
  payments: {
    getAll: (params?: any) =>
      api.get('/payments/history', { params }),
    getHistory: (params?: any) =>
      api.get('/payments/history', { params }),
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
    processRefund: (data: any) =>
      api.post('/payments/refund', data),
    getInvoice: (id: string) =>
      api.get(`/payments/invoice/${id}`),
  },

  // Reviews
  reviews: {
    create: (data: any) =>
      api.post('/reviews', data),
    getTherapistReviews: (id: string) =>
      api.get(`/reviews/therapist/${id}`),
    update: (id: string, data: any) =>
      api.patch(`/reviews/${id}`, data),
    delete: (id: string) =>
      api.delete(`/reviews/${id}`),
    respond: (id: string, data: any) =>
      api.post(`/reviews/${id}/respond`, data),
  },

  // Support
  support: {
    getTickets: (params?: any) =>
      api.get('/support/tickets', { params }),
    createTicket: (data: any) =>
      api.post('/support/tickets', data),
    getTicket: (id: string) =>
      api.get(`/support/tickets/${id}`),
    replyToTicket: (id: string, message: string, isInternal: boolean = false) =>
      api.post(`/support/tickets/${id}/messages`, { message, isInternal }),
    closeTicket: (id: string) =>
      api.post(`/support/tickets/${id}/close`),
    updateTicket: (id: string, data: any) =>
      api.patch(`/support/tickets/${id}`, data),
  },

  // Notifications
  notifications: {
    getAll: (params?: any) =>
      api.get('/notifications', { params }),
    markAsRead: (id: string) =>
      api.patch(`/notifications/${id}/read`),
    markAllAsRead: () =>
      api.patch('/notifications/read-all'),
    delete: (id: string) =>
      api.delete(`/notifications/${id}`),
    getUnread: () =>
      api.get('/notifications/unread'),
  },

  // Analytics
  analytics: {
    getUserProgress: () =>
      api.get('/analytics/progress'),
    getMoodTrends: (startDate?: string, endDate?: string) =>
      api.get('/analytics/mood-trends', { params: { startDate, endDate } }),
    logMood: (mood: number, energyLevel: number, anxietyLevel: number, notes?: string) =>
      api.post('/analytics/mood', { mood, energyLevel, anxietyLevel, notes }),
  },

  // Admin
  admin: {
    getDashboard: () =>
      api.get('/admin/analytics'),
    getUsers: (params?: any) =>
      api.get('/admin/users', { params }),
    getUser: (id: string) =>
      api.get(`/admin/users/${id}`),
    updateUser: (id: string, data: any) =>
      api.patch(`/admin/users/${id}`, data),
    deleteUser: (id: string) =>
      api.delete(`/admin/users/${id}`),
    getPendingVerifications: (params?: any) =>
      api.get('/admin/therapists/pending', { params }),
    verifyTherapist: (id: string, status: string, notes?: string) =>
      api.patch(`/admin/therapists/${id}/verify`, { status, notes }),
    getCrisisLogs: (params?: any) =>
      api.get('/admin/crisis-logs', { params }),
    getAuditLogs: (params?: any) =>
      api.get('/admin/audit-logs', { params }),
    getSettings: () =>
      api.get('/admin/settings'),
    updateSettings: (data: any) =>
      api.patch('/admin/settings', data),
    broadcast: (data: any) =>
      api.post('/admin/broadcast', data),
  },

  // Subscriptions
  subscriptions: {
    getPlans: () =>
      api.get('/subscriptions/plans'),
    getMine: () =>
      api.get('/subscriptions/mine'),
    subscribe: (planId: string) =>
      api.post('/subscriptions/subscribe', { planId }),
    upgrade: (planId: string) =>
      api.patch('/subscriptions/upgrade', { planId }),
    cancel: () =>
      api.delete('/subscriptions/cancel'),
    getUsage: () =>
      api.get('/subscriptions/usage'),
  },

  // Therapist Portal
  therapistPortal: {
    getProfile: () =>
      api.get('/therapists/me/profile'),
    updateProfile: (data: any) =>
      api.patch('/therapists/me/profile', data),
    getStats: () =>
      api.get('/therapists/me/stats'),
    updateAvailability: (data: any) =>
      api.patch('/therapists/me/availability', data),
    getAvailability: (params?: any) =>
      api.get('/therapists/me/availability', { params }),
    uploadDocuments: (data: any) =>
      api.post('/therapists/me/documents', data),
    getClients: (params?: any) =>
      api.get('/therapists/me/clients', { params }),
    getEarnings: (params?: any) =>
      api.get('/therapists/me/earnings', { params }),
    getSettings: () =>
      api.get('/therapists/me/settings'),
    updateSettings: (data: any) =>
      api.patch('/therapists/me/settings', data),
    submitApplication: (data: any) =>
      api.post('/therapists/register', data),
  },
};

export default api;
