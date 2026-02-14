import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';

export const registerVideoHandlers = (io: Server, socket: Socket) => {
    const user = (socket as any).user;

    // Join video room
    socket.on('video:join', (data: { sessionId: string }) => {
        socket.join(`video:${data.sessionId}`);
        socket.to(`video:${data.sessionId}`).emit('video:user-joined', {
            userId: user.userId,
            socketId: socket.id,
        });
        logger.debug(`User ${user.userId} joined video room: ${data.sessionId}`);
    });

    // Leave video room
    socket.on('video:leave', (data: { sessionId: string }) => {
        socket.leave(`video:${data.sessionId}`);
        socket.to(`video:${data.sessionId}`).emit('video:user-left', {
            userId: user.userId,
        });
        logger.debug(`User ${user.userId} left video room: ${data.sessionId}`);
    });

    // WebRTC signaling
    socket.on('video:offer', (data: { to: string; offer: any; sessionId: string }) => {
        io.to(`user:${data.to}`).emit('video:offer', {
            from: user.userId,
            offer: data.offer,
            sessionId: data.sessionId,
        });
    });

    socket.on('video:answer', (data: { to: string; answer: any; sessionId: string }) => {
        io.to(`user:${data.to}`).emit('video:answer', {
            from: user.userId,
            answer: data.answer,
            sessionId: data.sessionId,
        });
    });

    socket.on('video:ice-candidate', (data: { to: string; candidate: any; sessionId: string }) => {
        io.to(`user:${data.to}`).emit('video:ice-candidate', {
            from: user.userId,
            candidate: data.candidate,
            sessionId: data.sessionId,
        });
    });

    // Start/End call events
    socket.on('video:call-user', (data: { to: string; sessionId: string }) => {
        io.to(`user:${data.to}`).emit('video:incoming-call', {
            from: user.userId,
            sessionId: data.sessionId,
        });
    });

    socket.on('video:end-call', (data: { to: string; sessionId: string }) => {
        io.to(`user:${data.to}`).emit('video:call-ended', {
            from: user.userId,
            sessionId: data.sessionId,
        });
    });
};
