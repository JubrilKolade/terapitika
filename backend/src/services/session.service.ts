import { Session, Message, User, Therapist } from '../models';
import { SessionType, SessionStatus, CommunicationMode, ISession, SenderType } from '../types';
import * as AIService from './ai.service';
import logger from '../utils/logger';

export const createAISession = async (clientId: string): Promise<ISession> => {
    const session = await Session.create({
        client_id: clientId,
        session_type: SessionType.AI_ONLY,
        communication_mode: CommunicationMode.CHAT,
        status: SessionStatus.IN_PROGRESS,
        started_at: new Date(),
    });
    logger.info(`AI session created: ${session.id} for user ${clientId}`);
    return session.toJSON() as ISession;
};

export const createTherapistSession = async (clientId: string, therapistId: string, data: {
    communicationMode: CommunicationMode;
    scheduledAt?: Date;
}): Promise<ISession> => {
    const session = await Session.create({
        client_id: clientId,
        therapist_id: therapistId,
        session_type: SessionType.HUMAN_THERAPIST,
        communication_mode: data.communicationMode,
        scheduled_at: data.scheduledAt,
        status: data.scheduledAt ? SessionStatus.SCHEDULED : SessionStatus.IN_PROGRESS,
        started_at: data.scheduledAt ? undefined : new Date(),
    });
    logger.info(`Therapist session created: ${session.id}`);
    return session.toJSON() as ISession;
};

export const getSessionById = async (sessionId: string, userId?: string): Promise<ISession | null> => {
    const session = await Session.findByPk(sessionId, {
        include: [
            { model: User, as: 'client', attributes: ['id', 'first_name', 'last_name', 'email'] },
            { model: Therapist, as: 'therapist' },
        ],
    });
    if (!session) return null;
    if (userId && session.client_id !== userId && session.therapist_id !== userId) return null;
    return session.toJSON() as ISession;
};

export const getSessionMessages = async (sessionId: string, page = 1, limit = 50): Promise<{ messages: any[]; total: number }> => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Message.findAndCountAll({
        where: { session_id: sessionId },
        order: [['created_at', 'ASC']],
        limit,
        offset,
        include: [{ model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name'] }],
    });
    return { messages: rows.map(m => m.toJSON()), total: count };
};

export const addSessionNotes = async (sessionId: string, notes: string): Promise<ISession> => {
    const session = await Session.findByPk(sessionId);
    if (!session) throw new Error('Session not found');
    session.session_notes = notes;
    await session.save();
    return session.toJSON() as ISession;
};

export const getSessionSummary = async (sessionId: string): Promise<string> => {
    const session = await Session.findByPk(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.ai_summary) return session.ai_summary;

    const { messages } = await getSessionMessages(sessionId, 1, 1000);
    const chatMessages = messages.map(m => ({
        role: m.sender_type === SenderType.AI ? 'assistant' as const : 'user' as const,
        content: m.content,
    }));
    const summary = await AIService.generateSummary(chatMessages);
    session.ai_summary = summary;
    await session.save();
    return summary;
};

export const getUserSessions = async (userId: string, status?: SessionStatus, page = 1, limit = 20): Promise<{ sessions: ISession[]; total: number }> => {
    const offset = (page - 1) * limit;
    const where: any = { client_id: userId };
    if (status) where.status = status;

    const { count, rows } = await Session.findAndCountAll({
        where, limit, offset,
        order: [['created_at', 'DESC']],
        include: [{ model: Therapist, as: 'therapist' }],
    });
    return { sessions: rows.map(s => s.toJSON() as ISession), total: count };
};

export const startSession = async (sessionId: string): Promise<ISession> => {
    const session = await Session.findByPk(sessionId);
    if (!session) throw new Error('Session not found');
    await session.start();
    return session.toJSON() as ISession;
};

export const endSession = async (sessionId: string): Promise<ISession> => {
    const session = await Session.findByPk(sessionId);
    if (!session) throw new Error('Session not found');
    await session.end();
    return session.toJSON() as ISession;
};

export const cancelSession = async (sessionId: string, userId: string, reason: string): Promise<ISession> => {
    const session = await Session.findByPk(sessionId);
    if (!session) throw new Error('Session not found');
    await session.cancel(reason, userId);
    return session.toJSON() as ISession;
};

export const getSessionTranscript = async (sessionId: string): Promise<any[]> => {
    const { messages } = await getSessionMessages(sessionId, 1, 10000);
    return messages.map(m => ({
        timestamp: m.created_at,
        sender: m.sender_type,
        content: m.content,
    }));
};
