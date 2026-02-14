import { Response } from 'express';
import * as ChatService from '../services/chat.service';
import { AuthRequest, SenderType, ContentType } from '../types';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { sessionId, content, contentType, fileUrl } = req.body;
    const message = await ChatService.sendMessage({
        sessionId, senderId: req.user.id,
        senderType: req.user.role === 'therapist' ? SenderType.THERAPIST : SenderType.CLIENT,
        content, contentType, fileUrl,
    });
    return sendSuccess(res, message, 'Message sent', 201);
});

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { sessionId } = req.params as { sessionId: string };
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const result = await ChatService.getMessages(sessionId, page, limit);
    return sendSuccess(res, result);
});

export const editMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params as { id: string };
    const { content } = req.body;
    const message = await ChatService.editMessage(id, req.user.id, content);
    return sendSuccess(res, message);
});

export const deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params as { id: string };
    await ChatService.deleteMessage(id, req.user.id);
    return sendSuccess(res, null, 'Message deleted');
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { sessionId } = req.params as { sessionId: string };
    await ChatService.markAllAsRead(sessionId, req.user.id);
    return sendSuccess(res, null, 'Messages marked as read');
});

export const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { sessionId } = req.params as { sessionId: string };
    const count = await ChatService.getUnreadCount(sessionId, req.user.id);
    return sendSuccess(res, { count });
});
