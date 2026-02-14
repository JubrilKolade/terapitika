import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken, extractTokenFromHeader } from '../config/jwt';
import logger from '../utils/logger';
import { SocketUser } from '../types';
import { registerChatHandlers } from './chatHandler';
import { registerVideoHandlers } from './videoHandler';
import { registerPresenceHandlers } from './presenceHandler';

/**
 * Initialize WebSocket server
 */
export const initializeWebSocket = (httpServer: HTTPServer): Server => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    const connectedUsers: Map<string, SocketUser> = new Map();

    setupMiddleware(io);
    setupEventHandlers(io, connectedUsers);

    return io;
};

/**
 * Authenticate WebSocket connections via JWT
 */
const setupMiddleware = (io: Server): void => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token ||
                extractTokenFromHeader(socket.handshake.headers.authorization);

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const payload = verifyAccessToken(token);
            (socket as any).user = {
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            };

            next();
        } catch (error) {
            logger.error('WebSocket authentication failed:', error);
            next(new Error('Invalid or expired token'));
        }
    });
};

/**
 * Set up socket event handlers
 */
const setupEventHandlers = (io: Server, connectedUsers: Map<string, SocketUser>): void => {
    io.on('connection', (socket: Socket) => {
        const user = (socket as any).user;

        if (!user) {
            socket.disconnect(true);
            return;
        }

        // Track connected user
        const socketUser: SocketUser = {
            userId: user.userId,
            socketId: socket.id,
            role: user.role,
        };
        connectedUsers.set(user.userId, socketUser);

        logger.info(`WebSocket connected: ${user.userId} (${socket.id})`);

        // Join user-specific room for individual notifications
        socket.join(`user:${user.userId}`);

        // Register modular handlers
        registerChatHandlers(io, socket);
        registerVideoHandlers(io, socket);
        registerPresenceHandlers(io, socket, connectedUsers);

        // Notify others that user is online
        socket.broadcast.emit('presence:update', {
            userId: user.userId,
            status: 'online',
        });

        // Handle disconnect
        socket.on('disconnect', (reason: string) => {
            connectedUsers.delete(user.userId);
            logger.info(`WebSocket disconnected: ${user.userId} (${reason})`);

            // Notify others that user is offline
            socket.broadcast.emit('presence:update', {
                userId: user.userId,
                status: 'offline',
            });
        });

        // Handle errors
        socket.on('error', (error: Error) => {
            logger.error(`WebSocket error for ${user.userId}:`, error);
        });
    });
};

/**
 * Helper to send event to a specific user
 */
export const sendToUser = (io: Server, userId: string, event: string, data: any): void => {
    io.to(`user:${userId}`).emit(event, data);
};

/**
 * Helper to send event to all users in a session
 */
export const sendToSession = (io: Server, sessionId: string, event: string, data: any): void => {
    io.to(`session:${sessionId}`).emit(event, data);
};

/**
 * Helper to send notification to a user
 */
export const sendNotification = (io: Server, userId: string, notification: {
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
}): void => {
    sendToUser(io, userId, 'notification', notification);
};
