import { create } from 'zustand';
import { CallState, ConnectionStatus, MediaSettings, Participant } from '@/types';

interface CallActions {
  setRoomId: (roomId: string) => void;
  setSessionId: (sessionId: string) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, updates: Partial<Participant>) => void;
  setLocalStream: (stream: MediaStream) => void;
  setMediaSettings: (settings: Partial<MediaSettings>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setDuration: (duration: number) => void;
  resetCall: () => void;
}

export const useCallStore = create<CallState & CallActions>((set) => ({
  // Initial state
  roomId: '',
  sessionId: '',
  participants: [],
  localStream: undefined,
  mediaSettings: {
    video: true,
    audio: true,
    screenShare: false,
  },
  connectionStatus: ConnectionStatus.IDLE,
  duration: 0,

  // Actions
  setRoomId: (roomId) => set({ roomId }),
  setSessionId: (sessionId) => set({ sessionId }),
  addParticipant: (participant) =>
    set((state) => ({ participants: [...state.participants, participant] })),
  removeParticipant: (userId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.userId !== userId),
    })),
  updateParticipant: (userId, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.userId === userId ? { ...p, ...updates } : p
      ),
    })),
  setLocalStream: (stream) => set({ localStream: stream }),
  setMediaSettings: (settings) =>
    set((state) => ({
      mediaSettings: { ...state.mediaSettings, ...settings },
    })),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setDuration: (duration) => set({ duration }),
  resetCall: () =>
    set({
      roomId: '',
      sessionId: '',
      participants: [],
      localStream: undefined,
      connectionStatus: ConnectionStatus.IDLE,
      duration: 0,
    }),
}));
