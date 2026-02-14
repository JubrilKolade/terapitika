import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';
import { verifyAccessToken, extractTokenFromHeader } from '../config/jwt';
import { User } from '../models';
import { sendError } from '../utils/helpers';
import logger from '../utils/logger';

/**
 * Authenticate user with JWT token
 */
export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return sendError(res, 'No token provided', 401);
    }

    // Verify token
    const payload = verifyAccessToken(token);

    // Check if user exists and is active
    const user = await User.findByPk(payload.userId);

    if (!user || !user.is_active) {
      return sendError(res, 'User not found or inactive', 401);
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error: any) {
    logger.error('Authentication error:', error);
    return sendError(res, 'Invalid or expired token', 401);
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuthenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyAccessToken(token);
      const user = await User.findByPk(payload.userId);

      if (user && user.is_active) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    }
  } catch (error) {
    // Silently fail - authentication is optional
    logger.debug('Optional authentication failed:', error);
  }

  next();
}

/**
 * Require specific role(s)
 */
export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    next();
  };
}

/**
 * Require client role
 */
export function requireClient(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void | Response {
  return requireRole(UserRole.CLIENT, UserRole.ADMIN)(req, res, next);
}

/**
 * Require therapist role
 */
export function requireTherapist(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void | Response {
  return requireRole(UserRole.THERAPIST, UserRole.ADMIN)(req, res, next);
}

/**
 * Require admin role
 */
export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void | Response {
  return requireRole(UserRole.ADMIN)(req, res, next);
}

/**
 * Check if user owns the resource
 */
export function requireOwnership(userIdParam: string = 'userId') {
  return (req: AuthRequest, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    const resourceUserId = req.params[userIdParam];

    // Admins can access any resource
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    // User must own the resource
    if (req.user.id !== resourceUserId) {
      return sendError(res, 'Access denied - not resource owner', 403);
    }

    next();
  };
}

/**
 * Check if user is verified
 */
export async function requireVerified(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  if (!req.user) {
    return sendError(res, 'Authentication required', 401);
  }

  const user = await User.findByPk(req.user.id);

  if (!user || !user.is_verified) {
    return sendError(res, 'Email verification required', 403);
  }

  next();
}

export default {
  authenticate,
  optionalAuthenticate,
  requireRole,
  requireClient,
  requireTherapist,
  requireAdmin,
  requireOwnership,
  requireVerified,
};