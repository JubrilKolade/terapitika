import { Response } from 'express';
import * as SessionService from '../services/session.service';
import { AuthRequest, SessionStatus, CommunicationMode } from '../types';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';
import { logAuditEvent } from '../utils/logger';

export const createAISession = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const session = await SessionService.createAISession(req.user.id);
    logAuditEvent(req.user.id, 'session_created', 'session', session.id);
    return sendSuccess(res, session, 'AI session created', 201);
});

export const createTherapistSession = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { therapistId, communicationMode, scheduledAt } = req.body;
    const session = await SessionService.createTherapistSession(req.user.id, therapistId, {
        communicationMode, scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    });
    logAuditEvent(req.user.id, 'session_created', 'session', session.id);
    return sendSuccess(res, session, 'Therapist session created', 201);
});

export const getSession = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const session = await SessionService.getSessionById(id, req.user?.id);
    if (!session) return sendError(res, 'Session not found', 404);
    return sendSuccess(res, session);
});

export const getMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const result = await SessionService.getSessionMessages(id, page, limit);
    return sendSuccess(res, result);
});

export const addNotes = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const { notes } = req.body;
    const session = await SessionService.addSessionNotes(id, notes);
    return sendSuccess(res, session);
});

export const getSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const summary = await SessionService.getSessionSummary(id);
    return sendSuccess(res, { summary });
});

export const getUserSessions = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const page = parseInt(req.query.page as string) || 1;
    const status = req.query.status as SessionStatus | undefined;
    const result = await SessionService.getUserSessions(req.user.id, status, page);
    return sendSuccess(res, result);
});

export const endSession = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const session = await SessionService.endSession(id);
    logAuditEvent(req.user?.id, 'session_ended', 'session', id);
    return sendSuccess(res, session);
});

export const cancelSession = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params as { id: string };
    const { reason } = req.body;
    const session = await SessionService.cancelSession(id, req.user.id, reason);
    return sendSuccess(res, session);
});

export const getTranscript = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const transcript = await SessionService.getSessionTranscript(id);
    return sendSuccess(res, { transcript });
});
