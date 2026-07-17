import { Response } from 'express';
import * as AdminService from '../services/admin.service';
import { AuthRequest, UserRole, LicenseVerificationStatus } from '../types';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';
import { logAuditEvent } from '../utils/logger';

export const getDashboard = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const analytics = await AdminService.getDashboardAnalytics();
    return sendSuccess(res, analytics);
});

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const role = req.query.role as UserRole | undefined;
    const result = await AdminService.getAllUsers(page, 20, role);
    return sendSuccess(res, result);
});

export const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await AdminService.getUserById(id);
    return sendSuccess(res, user);
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await AdminService.updateUser(id, req.body);
    logAuditEvent(req.user?.id, 'admin_update_user', 'user', id);
    return sendSuccess(res, user);
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    await AdminService.deleteUser(id);
    logAuditEvent(req.user?.id, 'admin_delete_user', 'user', id);
    return sendSuccess(res, null, 'User deleted');
});

export const getPendingVerifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await AdminService.getPendingVerifications(page);
    return sendSuccess(res, result);
});

export const verifyTherapist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const { status, notes } = req.body;
    const therapist = await AdminService.verifyTherapist(id, status, notes);
    logAuditEvent(req.user?.id, 'admin_verify_therapist', 'therapist', id);
    return sendSuccess(res, therapist);
});

export const getCrisisLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const resolved = req.query.resolved !== undefined ? req.query.resolved === 'true' : undefined;
    const result = await AdminService.getCrisisLogs(page, 20, resolved);
    return sendSuccess(res, result);
});

export const getAuditLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const userId = req.query.userId as string | undefined;
    const result = await AdminService.getAuditLogs(page, 50, userId);
    return sendSuccess(res, result);
});

export const broadcast = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, message, targetRole } = req.body;
    const count = await AdminService.broadcastNotification(title, message, targetRole);
    logAuditEvent(req.user?.id, 'admin_broadcast', 'notification', undefined);
    return sendSuccess(res, { count }, `Broadcast sent to ${count} users`);
});
export const getSettings = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const settings = await AdminService.getSettings();
    return sendSuccess(res, settings);
});

export const updateSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const settings = await AdminService.updateSettings(req.body);
    logAuditEvent(req.user?.id, 'admin_update_settings', 'system_settings', undefined, req.body);
    return sendSuccess(res, settings, 'System settings updated');
});
