import { Router } from 'express';
import * as AIController from '../controllers/ai.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';
import { sanitizeBody } from '../middlewares/validation.middleware';
import { aiChatRateLimiter, guestChatRateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

/**
 * Public routes (no authentication)
 */

// Guest chat
router.post(
  '/guest/chat',
  guestChatRateLimiter,
  sanitizeBody,
  AIController.guestChat
);

/**
 * Protected routes (authentication required)
 */

// Start AI chat session
router.post(
  '/chat/start',
  authenticate,
  AIController.startSession
);

// Send message in AI chat
router.post(
  '/chat/message',
  authenticate,
  aiChatRateLimiter,
  sanitizeBody,
  AIController.sendMessage
);

// End AI chat session
router.post(
  '/chat/end',
  authenticate,
  sanitizeBody,
  AIController.endSession
);

// Get session messages
router.get(
  '/sessions/:sessionId/messages',
  authenticate,
  AIController.getSessionMessages
);

// Get coping strategies
router.post(
  '/coping-strategies',
  optionalAuthenticate,
  sanitizeBody,
  AIController.getCopingStrategies
);

export default router;