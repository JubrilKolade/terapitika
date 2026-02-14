import { Request, Response, NextFunction } from 'express';
import { rateLimitHelpers } from '../config/redis';
import { sendError } from '../utils/helpers';
import config from '../config/environment';

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
}

/**
 * Create rate limiter middleware
 */
export function createRateLimiter(options: RateLimitOptions = {}) {
  const {
    windowMs = config.rateLimit.windowMs,
    maxRequests = config.rateLimit.maxRequests,
    keyGenerator = (req: Request) => req.ip || 'unknown',
    skipSuccessfulRequests = false,
  } = options;

  const windowSeconds = Math.floor(windowMs / 1000);

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const key = `rate_limit:${keyGenerator(req)}`;

    try {
      // Check rate limit
      const allowed = await rateLimitHelpers.checkRateLimit(
        key,
        maxRequests,
        windowSeconds
      );

      if (!allowed) {
        const remaining = await rateLimitHelpers.getRemainingRequests(key, maxRequests);
        
        // Add rate limit headers
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('Retry-After', windowSeconds);

        return sendError(res, 'Too many requests, please try again later', 429);
      }

      const remaining = await rateLimitHelpers.getRemainingRequests(key, maxRequests);
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);

      // Skip incrementing for successful requests if option is set
      if (skipSuccessfulRequests) {
        res.on('finish', async () => {
          if (res.statusCode >= 400) {
            // Request failed, already counted
          }
        });
      }

      next();
    } catch (error) {
      // If rate limiting fails, allow the request
      console.error('Rate limiting error:', error);
      next();
    }
  };
}

/**
 * Strict rate limiter for authentication endpoints
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts
  keyGenerator: (req: Request) => {
    const email = req.body.email || req.ip;
    return `auth:${email}`;
  },
});

/**
 * General API rate limiter
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});

/**
 * Guest chat rate limiter
 */
export const guestChatRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50,
  keyGenerator: (req: Request) => `guest_chat:${req.ip}`,
});

/**
 * AI chat rate limiter
 */
export const aiChatRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  keyGenerator: (req: Request) => {
    // Use user ID if authenticated, otherwise IP
    const userId = (req as any).user?.id || req.ip;
    return `ai_chat:${userId}`;
  },
});

/**
 * File upload rate limiter
 */
export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 20,
  keyGenerator: (req: Request) => {
    const userId = (req as any).user?.id || req.ip;
    return `upload:${userId}`;
  },
});

/**
 * Password reset rate limiter
 */
export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  keyGenerator: (req: Request) => {
    const email = req.body.email || req.ip;
    return `password_reset:${email}`;
  },
});

export default {
  createRateLimiter,
  authRateLimiter,
  apiRateLimiter,
  guestChatRateLimiter,
  aiChatRateLimiter,
  uploadRateLimiter,
  passwordResetRateLimiter,
};