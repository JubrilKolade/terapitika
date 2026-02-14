import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';
import {
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateChangePassword,
  validateEmailVerification,
  validateRefreshToken,
  sanitizeBody,
} from '../middlewares/validation.middleware';
import {
  authRateLimiter,
  passwordResetRateLimiter,
} from '../middlewares/rateLimit.middleware';

const router = Router();

/**
 * Public routes (no authentication required)
 */

// Register new user
router.post(
  '/register',
  authRateLimiter,
  sanitizeBody,
  validateRegistration,
  AuthController.register
);

// Login
router.post(
  '/login',
  authRateLimiter,
  sanitizeBody,
  validateLogin,
  AuthController.login
);

// Request password reset
router.post(
  '/forgot-password',
  passwordResetRateLimiter,
  sanitizeBody,
  validatePasswordResetRequest,
  AuthController.forgotPassword
);

// Reset password with token
router.post(
  '/reset-password',
  sanitizeBody,
  validatePasswordReset,
  AuthController.resetPassword
);

// Verify email
router.post(
  '/verify-email',
  sanitizeBody,
  validateEmailVerification,
  AuthController.verifyEmail
);

// OAuth callback (would be configured with Passport.js)
router.get('/google/callback', AuthController.oauthCallback);
router.get('/facebook/callback', AuthController.oauthCallback);

/**
 * Protected routes (authentication required)
 */

// Logout
router.post('/logout', authenticate, AuthController.logout);

// Refresh access token
router.post(
  '/refresh',
  authenticate,
  sanitizeBody,
  validateRefreshToken,
  AuthController.refreshToken
);

// Change password
router.post(
  '/change-password',
  authenticate,
  sanitizeBody,
  validateChangePassword,
  AuthController.changePassword
);

// Send email verification
router.post('/send-verification', authenticate, AuthController.sendVerification);

// Get current user
router.get('/me', authenticate, AuthController.getCurrentUser);

/**
 * Semi-protected routes (optional authentication)
 */

// Check auth status
router.get('/status', optionalAuthenticate, AuthController.checkStatus);

export default router;