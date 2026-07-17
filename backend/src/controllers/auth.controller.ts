import { Response } from 'express';
import { AuthRequest } from '../types';
import * as AuthService from '../services/auth.service';
import { verifyRefreshToken } from '../config/jwt';
import { sendSuccess, sendError } from '../utils/helpers';
import { logAuditEvent } from '../utils/logger';
import { asyncHandler } from '../middlewares/error.middleware';

/**
 * Register new user
 */
export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, firstName, lastName, dateOfBirth, phone, role } = req.body;
  const result = await AuthService.register({ email, password, firstName, lastName, dateOfBirth, phone, role });
  logAuditEvent(result.user.id, 'user_registered', 'user', result.user.id);
  return sendSuccess(res, { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken }, 'Registration successful', 201);
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.login({ email, password });
  logAuditEvent(result.user.id, 'user_login', 'user', result.user.id, { ip: req.ip, userAgent: req.headers['user-agent'] });
  return sendSuccess(res, { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
});

/**
 * Logout user
 */
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  await AuthService.logout(req.user.id);
  logAuditEvent(req.user.id, 'user_logout', 'user', req.user.id);
  return sendSuccess(res, null, 'Logout successful');
});

/**
 * Refresh access token
 */
export const refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) return sendError(res, 'Refresh token required', 400);

  const payload = verifyRefreshToken(token);
  const tokens = await AuthService.refreshToken(payload.userId, token);
  return sendSuccess(res, tokens, 'Token refreshed');
});

/**
 * Request password reset
 */
export const forgotPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  await AuthService.requestPasswordReset(email);
  return sendSuccess(res, null, 'If an account exists, a password reset email has been sent');
});

/**
 * Reset password
 */
export const resetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token, newPassword } = req.body;
  await AuthService.resetPassword(token, newPassword);
  logAuditEvent(undefined, 'password_reset', 'user', undefined);
  return sendSuccess(res, null, 'Password reset successful');
});

/**
 * Change password
 */
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const { currentPassword, newPassword } = req.body;
  await AuthService.changePassword(req.user.id, currentPassword, newPassword);
  logAuditEvent(req.user.id, 'password_changed', 'user', req.user.id);
  return sendSuccess(res, null, 'Password changed successfully');
});

/**
 * Verify email
 */
export const verifyEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  await AuthService.verifyEmail(token);
  logAuditEvent(undefined, 'email_verified', 'user', undefined);
  return sendSuccess(res, null, 'Email verified successfully');
});

/**
 * Send email verification
 */
export const sendVerification = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  await AuthService.sendEmailVerification(req.user.id);
  return sendSuccess(res, null, 'Verification email sent');
});

/**
 * Get current user
 */
export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const { User } = require('../models');
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
  if (!user) return sendError(res, 'User not found', 404);
  return sendSuccess(res, user);
});

/**
 * OAuth callback handler
 */
export const oauthCallback = asyncHandler(async (req: AuthRequest, res: Response) => {
  const oauthData = (req as any).user;
  if (!oauthData) return sendError(res, 'OAuth authentication failed', 401);
  const result = await AuthService.oauthLogin(oauthData);
  logAuditEvent(result.user.id, 'oauth_login', 'user', result.user.id, { provider: oauthData.provider, isNewUser: result.isNewUser });
  return sendSuccess(res, { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken, isNewUser: result.isNewUser });
});

/**
 * Check auth status
 */
export const checkStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const isAuthenticated = !!req.user;
  return sendSuccess(res, { isAuthenticated, user: req.user || null });
});
