import Redis from 'ioredis';
import config from './environment';

// Create Redis client
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// Event listeners
redis.on('connect', () => {
  console.log('✓ Redis client connected');
});

redis.on('error', (error) => {
  console.error('✗ Redis client error:', error);
});

redis.on('ready', () => {
  console.log('✓ Redis client ready');
});

// Helper functions
export const redisHelpers = {
  // Set with expiration
  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    return redis.setex(key, seconds, value);
  },
  
  // Get value
  async get(key: string): Promise<string | null> {
    return redis.get(key);
  },
  
  // Delete key
  async del(key: string): Promise<number> {
    return redis.del(key);
  },
  
  // Check if key exists
  async exists(key: string): Promise<number> {
    return redis.exists(key);
  },
  
  // Set JSON object
  async setJSON(key: string, value: any, expiresIn?: number): Promise<'OK' | null> {
    const jsonString = JSON.stringify(value);
    if (expiresIn) {
      return redis.setex(key, expiresIn, jsonString);
    }
    return redis.set(key, jsonString);
  },
  
  // Get JSON object
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
  
  // Increment counter
  async incr(key: string): Promise<number> {
    return redis.incr(key);
  },
  
  // Set with expiration if not exists
  async setnx(key: string, value: string, expiresIn?: number): Promise<number> {
    const result = await redis.setnx(key, value);
    if (result === 1 && expiresIn) {
      await redis.expire(key, expiresIn);
    }
    return result;
  },
  
  // Get TTL
  async ttl(key: string): Promise<number> {
    return redis.ttl(key);
  },
  
  // Flush all keys (use with caution!)
  async flushAll(): Promise<'OK'> {
    return redis.flushall();
  },
};

// Session management helpers
export const sessionHelpers = {
  // Store user session
  async setSession(userId: string, sessionData: any, expiresIn = 7 * 24 * 60 * 60): Promise<void> {
    const key = `session:${userId}`;
    await redisHelpers.setJSON(key, sessionData, expiresIn);
  },
  
  // Get user session
  async getSession(userId: string): Promise<any | null> {
    const key = `session:${userId}`;
    return redisHelpers.getJSON(key);
  },
  
  // Delete user session
  async deleteSession(userId: string): Promise<void> {
    const key = `session:${userId}`;
    await redis.del(key);
  },
  
  // Store refresh token
  async setRefreshToken(userId: string, token: string, expiresIn = 7 * 24 * 60 * 60): Promise<void> {
    const key = `refresh_token:${userId}`;
    await redis.setex(key, expiresIn, token);
  },
  
  // Verify refresh token
  async verifyRefreshToken(userId: string, token: string): Promise<boolean> {
    const key = `refresh_token:${userId}`;
    const storedToken = await redis.get(key);
    return storedToken === token;
  },
  
  // Delete refresh token
  async deleteRefreshToken(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await redis.del(key);
  },
};

// Rate limiting helpers
export const rateLimitHelpers = {
  // Check rate limit
  async checkRateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }
    
    return current <= maxRequests;
  },
  
  // Get remaining requests
  async getRemainingRequests(key: string, maxRequests: number): Promise<number> {
    const current = await redis.get(key);
    if (!current) return maxRequests;
    return Math.max(0, maxRequests - parseInt(current, 10));
  },
};

// Cache helpers
export const cacheHelpers = {
  // Cache with TTL
  async cache(key: string, value: any, ttl = 3600): Promise<void> {
    await redisHelpers.setJSON(key, value, ttl);
  },
  
  // Get cached value
  async getCached<T>(key: string): Promise<T | null> {
    return redisHelpers.getJSON<T>(key);
  },
  
  // Invalidate cache
  async invalidate(key: string): Promise<void> {
    await redis.del(key);
  },
  
  // Invalidate pattern
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};

export default redis;