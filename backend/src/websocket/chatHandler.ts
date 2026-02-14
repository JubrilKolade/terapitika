import { Server, Socket } from 'socket.io';
import * as ChatService from '../services/chat.service';
import { SenderType, ContentType } from '../types';
import logger from '../utils/logger';

export const registerChatHandlers = (io: Server, socket: Socket) => {
    const user = (socket as any).user;

    // Join session room
    socket.on('chat:join', (sessionId: string) => {
        socket.join(`session:${sessionId}`);
        logger.debug(`User ${user.userId} joined session room: ${sessionId}`);
    });

    // Leave session room
    socket.on('chat:leave', (sessionId: string) => {
        socket.leave(`session:${sessionId}`);
        logger.debug(`User ${user.userId} left session room: ${sessionId}`);
    });

    // Send message
    socket.on('chat:message', async (data: {
        sessionId: string;
        content: string;
        contentType?: ContentType;
        fileUrl?: string;
    }) => {
        try {
            const message = await ChatService.sendMessage({
                sessionId: data.sessionId,
                senderId: user.userId,
                senderType: user.role === 'therapist' ? SenderType.THERAPIST : SenderType.CLIENT,
                content: data.content,
                contentType: data.contentType || ContentType.TEXT,
                fileUrl: data.fileUrl,
            });

            // Broadcast to session room
            io.to(`session:${data.sessionId}`).emit('chat:message', message);

            // If crisis detected, emit special event
            if (message.crisis_detected) {
                io.to(`session:${data.sessionId}`).emit('chat:crisis', {
                    messageId: message.id,
                    severity: message.crisis_severity
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
