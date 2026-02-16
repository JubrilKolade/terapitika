import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authstore';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const { accessToken } = useAuthStore.getState();

    this.socket = io(WS_URL, {
      auth: {
        token: accessToken,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();

    return this.socket;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Chat events
  joinChatRoom(sessionId: string): void {
    this.socket?.emit('chat:join', { sessionId });
  }

  leaveChatRoom(sessionId: string): void {
    this.socket?.emit('chat:leave', { sessionId });
  }

  sendMessage(sessionId: string, message: any): void {
    this.socket?.emit('chat:message', { sessionId, message });
  }

  startTyping(sessionId: string): void {
    this.socket?.emit('chat:typing:start', { sessionId });
  }

  stopTyping(sessionId: string): void {
    this.socket?.emit('chat:typing:stop', { sessionId });
  }

  onNewMessage(callback: (data: any) => void): void {
    this.socket?.on('chat:message:new', callback);
  }

  onTypingStart(callback: (data: any) => void): void {
    this.socket?.on('chat:typing:start', callback);
  }

  onTypingStop(callback: (data: any) => void): void {
    this.socket?.on('chat:typing:stop', callback);
  }

  // Video/Voice call events
  joinCallRoom(roomId: string): void {
    this.socket?.emit('call:join', { roomId });
  }

  leaveCallRoom(roomId: string): void {
    this.socket?.emit('call:leave', { roomId });
  }

  sendSignal(roomId: string, signal: any, to: string): void {
    this.socket?.emit('call:signal', { roomId, signal, to });
  }

  onUserJoined(callback: (data: any) => void): void {
    this.socket?.on('call:user:joined', callback);
  }

  onUserLeft(callback: (data: any) => void): void {
    this.socket?.on('call:user:left', callback);
  }

  onReceiveSignal(callback: (data: any) => void): void {
    this.socket?.on('call:signal', callback);
  }

  onCallEnded(callback: (data: any) => void): void {
    this.socket?.on('call:ended', callback);
  }

  // Notification events
  onNotification(callback: (data: any) => void): void {
    this.socket?.on('notification', callback);
  }

  // Session events
  onSessionUpdate(callback: (data: any) => void): void {
    this.socket?.on('session:update', callback);
  }

  onSessionCancelled(callback: (data: any) => void): void {
    this.socket?.on('session:cancelled', callback);
  }

  // Crisis alert events
  onCrisisAlert(callback: (data: any) => void): void {
    this.socket?.on('crisis:alert', callback);
  }

  // Remove event listeners
  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }
}

export const socketService = new SocketService();
export default socketService;
