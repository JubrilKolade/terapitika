import { Response } from 'express';
import { AuthRequest } from '../types';
import * as UserService from '../services/user.service';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';
import { logAuditEvent } from '../utils/logger';

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }
  const user = await UserService.getUserById(req.user.id);
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  return sendSuccess(res, user);
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }
  const updates = req.body;
  const user = await UserService.updateProfile(req.user.id, updates);
  logAuditEvent(req.user.id, 'profile_updated', 'user', req.user.id);
  return sendSuccess(res, user, 'Profile updated successfully');
});

/**
 * Update profile picture
 */
export const updateProfilePicture = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }
  const { pictureUrl } = req.body;
  if (!pictureUrl) {
    return sendError(res, 'Picture URL is required', 400);
  }
  const url = await UserService.updateProfilePicture(req.user.id, pictureUrl);
  return sendSuccess(res, { profilePictureUrl: url }, 'Profile picture updated');
});

/**
 * Update user preferences
 */
export const updatePreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }
  const preferences = await UserService.updatePreferences(req.user.id, req.body);
  return sendSuccess(res, preferences, 'Preferences updated');
});

/**
 * Get user statistics
 */
export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }
  const stats = await UserService.getUserStats(req.user.id);
  return sendSuccess(res, stats);
});

/**
 * Deactivate account
 */
export const deactivateAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }
  await UserService.deactivateAccount(req.user.id);
  logAuditEvent(req.user.id, 'account_deactivated', 'user', req.user.id);
  return sendSuccess(res, null, 'Account deactivated successfully');
});

/**
 * Delete account permanently
 */
export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }
  await UserService.deleteAccount(req.user.id);
  logAuditEvent(req.user.id, 'account_deleted', 'user', req.user.id);
  return sendSuccess(res, null, 'Account deleted successfully');
});

/**
 * Search users (admin only)
 */
export const searchUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { query, role, page = 1, limit = 20 } = req.query;
  if (!query) {
    return sendError(res, 'Search query is required', 400);
  }
  const result = await UserService.searchUsers(
    query as string,
    role as any,
    parseInt(page as string),
    parseInt(limit as string)
  );
  return sendSuccess(res, result);
});

/**
 * Get all users (admin only)
 */
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20, role } = req.query;
  const result = await UserService.getAllUsers(
    parseInt(page as string),
    parseInt(limit as string),
    role as any
  );
  return sendSuccess(res, result);
});