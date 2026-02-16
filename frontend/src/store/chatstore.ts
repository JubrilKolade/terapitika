import { create } from 'zustand';
import { Message, ChatSession, SessionType } from '@/types';
import { api } from '@/lib/api';

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  isTyping: boolean;
  typingUsers: Set<string>;
}

interface ChatActions {
  fetchSessions: () => Promise<void>;
  fetchMessages: (sessionId: string) => Promise<void>;
  setActiveSession: (sessionId: string | null) => void;
  sendMessage: (sessionId: string, content: string, type?: string) => Promise<void>;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  createSession: (type: SessionType, participantId?: string) => Promise<ChatSession>;
  markAsRead: (sessionId: string) => Promise<void>;
  setTyping: (sessionId: string, isTyping: boolean) => void;
  addTypingUser: (sessionId: string, userId: string) => void;
  removeTypingUser: (sessionId: string, userId: string) => void;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  // Initial state
  sessions: [],
  activeSessionId: null,
  messages: {},
  isLoading: false,
  isTyping: false,
  typingUsers: new Set(),

  // Actions
  fetchSessions: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/chat/sessions');
      set({ sessions: response.data.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch chat sessions:', error);
      set({ isLoading: false });
    }
  },

  fetchMessages: async (sessionId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/chat/sessions/${sessionId}/messages`);
      set((state) => ({
        messages: {
          ...state.messages,
          [sessionId]: response.data.data,
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({ isLoading: false });
    }
  },

  setActiveSession: (sessionId: string | null) => {
    set({ activeSessionId: sessionId });
    if (sessionId) {
      get().fetchMessages(sessionId);
    }
  },

  sendMessage: async (sessionId: string, content: string, type = 'TEXT') => {
    try {
      const response = await api.post(`/chat/sessions/${sessionId}/messages`, {
        content,
        type,
      });
      const message = response.data.data;
      get().addMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  addMessage: (message: Message) => {
    set((state) => {
      const sessionMessages = state.messages[message.sessionId] || [];
      return {
        messages: {
          ...state.messages,
          [message.sessionId]: [...sessionMessages, message],
        },
      };
    });
  },

  updateMessage: (messageId: string, updates: Partial<Message>) => {
    set((state) => {
      const newMessages: Record<string, Message[]> = {};
      Object.keys(state.messages).forEach((sessionId) => {
        newMessages[sessionId] = state.messages[sessionId].map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        );
      });
      return { messages: newMessages };
    });
  },

  deleteMessage: (messageId: string) => {
    set((state) => {
      const newMessages: Record<string, Message[]> = {};
      Object.keys(state.messages).forEach((sessionId) => {
        newMessages[sessionId] = state.messages[sessionId].filter(
          (msg) => msg.id !== messageId
        );
      });
      return { messages: newMessages };
    });
  },

  createSession: async (type: SessionType, participantId?: string) => {
    try {
      const response = await api.post('/chat/sessions', {
        type,
        participantId,
      });
      const session = response.data.data;
      set((state) => ({
        sessions: [...state.sessions, session],
      }));
      return session;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  },

  markAsRead: async (sessionId: string) => {
    try {
      await api.post(`/chat/sessions/${sessionId}/read`);
      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === sessionId
            ? { ...session, unreadCount: 0 }
            : session
        ),
      }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  setTyping: (sessionId: string, isTyping: boolean) => {
    set({ isTyping });
  },

  addTypingUser: (sessionId: string, userId: string) => {
    set((state) => {
      const newTypingUsers = new Set(state.typingUsers);
      newTypingUsers.add(userId);
      return { typingUsers: newTypingUsers };
    });
  },

  removeTypingUser: (sessionId: string, userId: string) => {
    set((state) => {
      const newTypingUsers = new Set(state.typingUsers);
      newTypingUsers.delete(userId);
      return { typingUsers: newTypingUsers };
    });
  },
}));
