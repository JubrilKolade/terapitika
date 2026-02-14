import { Response } from 'express';
import * as NotificationService from '../services/notification.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';

export const getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const page = parseInt(req.query.page as string) || 1;
    const result = await NotificationService.getUserNotifications(req.user.id, page);
    return sendSuccess(res, result);
});

export const getUnread = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const result = await NotificationService.getUnreadNotifications(req.user.id);
    return sendSuccess(res, result);
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params as { id: string };
    await NotificationService.markAsRead(id, req.user.id);
    return sendSuccess(res, null, 'Marked as read');
});

export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const count = await NotificationService.markAllAsRead(req.user.id);
    return sendSuccess(res, { count }, 'All marked as read');
});

export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params as { id: string };
    await NotificationService.deleteNotification(id, req.user.id);
    return sendSuccess(res, null, 'Notification deleted');
});
