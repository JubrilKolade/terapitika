import { Server, Socket } from 'socket.io';
import { User } from '../models';
import logger from '../utils/logger';

export const registerPresenceHandlers = (io: Server, socket: Socket, connectedUsers: Map<string, any>) => {
    const user = (socket as any).user;

    // Update presence status
    socket.on('presence:status', async (status: 'online' | 'away' | 'offline') => {
        try {
            // In a real app, you might update the user table or a Redis store
            // For now, we broadcast to friends/relevant rooms
            socket.broadcast.emit('presence:update', {
                userId: user.userId,
                status,
            });
            logger.debug(`User ${user.userId} updated status to: ${status}`);
        } catch (error) {
            logger.error('Failed to update presence:', error);
        }
    });

    // This is called on connection/disconnection by WebSocketManager
    // but specific hooks can be added here
};
