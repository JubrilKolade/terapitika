import { Op } from 'sequelize';
import { Message, User } from '../models';
import { SenderType, ContentType, IMessage } from '../types';
import * as CrisisDetectionService from './crisis.service';
import logger from '../utils/logger';

export const sendMessage = async (data: {
    sessionId: string;
    senderId?: string;
    senderType: SenderType;
    content: string;
    contentType?: ContentType;
    fileUrl?: string;
}): Promise<IMessage> => {
    // Crisis detection for client messages
    let crisisDetected = false;
    let crisisSeverity: string | undefined;

    if (data.senderType === SenderType.CLIENT || data.senderType === SenderType.GUEST) {
        const analysis = await CrisisDetectionService.detectCrisis(data.content);
        crisisDetected = analysis.isCrisis;
        crisisSeverity = analysis.isCrisis ? analysis.severity : undefined;
    }

    const message = await Message.create({
        session_id: data.sessionId,
        sender_id: data.senderId,
        sender_type: data.senderType,
        content: data.content,
        content_type: data.contentType || ContentType.TEXT,
        file_url: data.fileUrl,
        crisis_detected: crisisDetected,
        crisis_severity: crisisSeverity,
        ai_flagged: crisisDetected,
        is_edited: false,
    });

    if (crisisDetected) {
        logger.warn(`Crisis detected in message ${message.id}, severity: ${crisisSeverity}`);
    }

    return message.toJSON() as IMessage;
};

export const getMessages = async (sessionId: string, page = 1, limit = 50): Promise<{ messages: IMessage[]; total: number }> => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Message.findAndCountAll({
        where: { session_id: sessionId },
        order: [['created_at', 'ASC']],
        limit, offset,
        include: [{ model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name', 'profile_picture_url'] }],
    });
    return { messages: rows.map(m => m.toJSON() as IMessage), total: count };
};

export const editMessage = async (messageId: string, userId: string, newContent: string): Promise<IMessage> => {
    const message = await Message.findByPk(messageId);
    if (!message) throw new Error('Message not found');
    if (message.sender_id !== userId) throw new Error('Cannot edit another user\'s message');
    await message.update({ content: newContent, is_edited: true, edited_at: new Date() });
    return message.toJSON() as IMessage;
};

export const deleteMessage = async (messageId: string, userId: string): Promise<void> => {
    const message = await Message.findByPk(messageId);
    if (!message) throw new Error('Message not found');
    if (message.sender_id !== userId) throw new Error('Cannot delete another user\'s message');
    await message.destroy();
};

export const markAsRead = async (messageId: string): Promise<void> => {
    const message = await Message.findByPk(messageId);
    if (!message) throw new Error('Message not found');
    await message.update({ read_at: new Date() });
};

export const markAllAsRead = async (sessionId: string, userId: string): Promise<void> => {
    await Message.update(
        { read_at: new Date() },
        {
            where: {
                session_id: sessionId,
                sender_id: { [Op.ne]: userId },
                read_at: { [Op.is]: null } as any,
            },
        }
    );
};

export const getUnreadCount = async (sessionId: string, userId: string): Promise<number> => {
    const count = await Message.count({
        where: {
            session_id: sessionId,
            sender_id: { [Op.ne]: userId },
            read_at: { [Op.is]: null } as any,
        },
    });
    return count as number;
};
