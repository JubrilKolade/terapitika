import { Server, Socket } from 'socket.io';
import * as ChatService from '../services/chat.service';
import { SenderType, ContentType } from '../types';
import logger from '../utils/logger';

export const registerChatHandlers = (io: Server, socket: Socket) => {
    const user = (socket as any).user;

    const normalizeSessionId = (payload: unknown): string | null => {
        if (typeof payload === 'string') return payload;
        if (payload && typeof payload === 'object' && 'sessionId' in payload) {
            const v = (payload as any).sessionId;
            if (typeof v === 'string') return v;
        }
        return null;
    };

    // Join session room
    socket.on('chat:join', (payload: unknown) => {
        const sessionId = normalizeSessionId(payload);
        if (!sessionId) return;
        socket.join(`session:${sessionId}`);
        logger.debug(`User ${user.userId} joined session room: ${sessionId}`);
    });

    // Leave session room
    socket.on('chat:leave', (payload: unknown) => {
        const sessionId = normalizeSessionId(payload);
        if (!sessionId) return;
        socket.leave(`session:${sessionId}`);
        logger.debug(`User ${user.userId} left session room: ${sessionId}`);
    });

    // Send message
    socket.on('chat:message', async (data: {
        sessionId: string;
        content: string;
        contentType?: ContentType;
        fileUrl?: string;
        // client-compat shape: { sessionId, message }
        message?: any;
    }) => {
        try {
            if (!data?.sessionId || typeof data.sessionId !== 'string') {
                socket.emit('chat:error', { message: 'sessionId is required' });
                return;
            }

            const content =
                typeof data.content === 'string'
                    ? data.content
                    : typeof (data as any).message === 'string'
                        ? (data as any).message
                        : typeof (data as any).message?.content === 'string'
                            ? (data as any).message.content
                            : '';

            if (!content) {
                socket.emit('chat:error', { message: 'Message content is required' });
                return;
            }

            const message = await ChatService.sendMessage({
                sessionId: data.sessionId,
                senderId: user.userId,
                senderType: user.role === 'therapist' ? SenderType.THERAPIST : SenderType.CLIENT,
                content,
                contentType: data.contentType || ContentType.TEXT,
                fileUrl: data.fileUrl,
            });

            // Broadcast to session room
            io.to(`session:${data.sessionId}`).emit('chat:message', message);
            io.to(`session:${data.sessionId}`).emit('chat:message:new', message);

            // If crisis detected, emit special event
            if (message.crisis_detected) {
                io.to(`session:${data.sessionId}`).emit('chat:crisis', {
                    messageId: message.id,
                    severity: message.crisis_severity
                });
                io.to(`session:${data.sessionId}`).emit('crisis:alert', {
                    sessionId: data.sessionId,
                    messageId: message.id,
                    severity: message.crisis_severity,
                });
            }
        } catch (error) {
            logger.error('Failed to process socket message:', error);
            socket.emit('chat:error', { message: 'Failed to send message' });
        }
    });

    // Typing indicator
    socket.on('chat:typing', (data: { sessionId: string; isTyping: boolean }) => {
        socket.to(`session:${data.sessionId}`).emit('chat:typing', {
            userId: user.userId,
            isTyping: data.isTyping,
        });
        socket.to(`session:${data.sessionId}`).emit(data.isTyping ? 'chat:typing:start' : 'chat:typing:stop', {
            userId: user.userId,
        });
    });

    socket.on('chat:typing:start', (payload: unknown) => {
        const sessionId = normalizeSessionId(payload);
        if (!sessionId) return;
        socket.to(`session:${sessionId}`).emit('chat:typing', { userId: user.userId, isTyping: true });
        socket.to(`session:${sessionId}`).emit('chat:typing:start', { userId: user.userId });
    });

    socket.on('chat:typing:stop', (payload: unknown) => {
        const sessionId = normalizeSessionId(payload);
        if (!sessionId) return;
        socket.to(`session:${sessionId}`).emit('chat:typing', { userId: user.userId, isTyping: false });
        socket.to(`session:${sessionId}`).emit('chat:typing:stop', { userId: user.userId });
    });

    // Mark as read
    socket.on('chat:read', async (data: { sessionId: string }) => {
        try {
            await ChatService.markAllAsRead(data.sessionId, user.userId);
            socket.to(`session:${data.sessionId}`).emit('chat:read', {
                userId: user.userId,
                sessionId: data.sessionId,
            });
        } catch (error) {
            logger.error('Failed to mark messages as read via socket:', error);
        }
    });
};
