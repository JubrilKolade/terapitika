import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';

export const registerVideoHandlers = (io: Server, socket: Socket) => {
    const user = (socket as any).user;

    const normalizeRoomId = (payload: unknown): string | null => {
        if (payload && typeof payload === 'object' && 'roomId' in payload) {
            const v = (payload as any).roomId;
            if (typeof v === 'string') return v;
        }
        if (payload && typeof payload === 'object' && 'sessionId' in payload) {
            const v = (payload as any).sessionId;
            if (typeof v === 'string') return v;
        }
        return null;
    };

    // Generic call room (frontend compatibility)
    socket.on('call:join', (payload: unknown) => {
        const roomId = normalizeRoomId(payload);
        if (!roomId) return;

        socket.join(`call:${roomId}`);
        // also join video room so both namespaces work
        socket.join(`video:${roomId}`);

        socket.to(`call:${roomId}`).emit('call:user:joined', { userId: user.userId, socketId: socket.id, roomId });
        socket.to(`video:${roomId}`).emit('video:user-joined', { userId: user.userId, socketId: socket.id });
        logger.debug(`User ${user.userId} joined call room: ${roomId}`);
    });

    socket.on('call:leave', (payload: unknown) => {
        const roomId = normalizeRoomId(payload);
        if (!roomId) return;

        socket.leave(`call:${roomId}`);
        socket.leave(`video:${roomId}`);

        socket.to(`call:${roomId}`).emit('call:user:left', { userId: user.userId, roomId });
        socket.to(`video:${roomId}`).emit('video:user-left', { userId: user.userId });
        logger.debug(`User ${user.userId} left call room: ${roomId}`);
    });

    socket.on('call:signal', (data: { roomId: string; signal: any; to: string }) => {
        io.to(`user:${data.to}`).emit('call:signal', {
            from: user.userId,
            roomId: data.roomId,
            signal: data.signal,
        });
    });

    socket.on('call:end', (payload: unknown) => {
        const roomId = normalizeRoomId(payload);
        if (!roomId) return;
        io.to(`call:${roomId}`).emit('call:ended', { roomId, by: user.userId });
        io.to(`video:${roomId}`).emit('video:call-ended', { from: user.userId, sessionId: roomId });
        socket.leave(`call:${roomId}`);
        socket.leave(`video:${roomId}`);
    });

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
