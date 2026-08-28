import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const checkReviewQuota = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      next(new RateLimitError(0, 'User not authenticated'));
      return;
    }

    next();
  } catch (error) {
    logger.error('Rate limit check failed', {
      error: error instanceof Error ? error.message : error,
      userId: req.userId,
    });
    next(error);
  }
};

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const globalRateLimiter = (
  windowMs: number = 60000,
  maxRequests: number = 100
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    if (!store[key] || now >= store[key].resetTime) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    store[key].count += 1;

    const remaining = Math.max(
      0,
      maxRequests - store[key].count
    );

    res.set('X-RateLimit-Limit', String(maxRequests));
    res.set('X-RateLimit-Remaining', String(remaining));
    res.set('X-RateLimit-Reset', String(store[key].resetTime));

    if (store[key].count > maxRequests) {
      const retryAfter = Math.max(
        0,
        Math.ceil((store[key].resetTime - now) / 1000)
      );

      res.set('Retry-After', String(retryAfter));

      logger.warn('Global rate limit exceeded', {
        ip: key,
        maxRequests,
        windowMs,
        retryAfter,
      });

      next(
        new RateLimitError(
          retryAfter,
          'Too many requests from this IP'
        )
      );
      return;
    }

    next();
  };
};