"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalRateLimiter = exports.checkReviewQuota = void 0;
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../utils/logger");
const checkReviewQuota = async (req, res, next) => {
    try {
        if (!req.userId) {
            next(new ApiError_1.RateLimitError(0, 'User not authenticated'));
            return;
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('Rate limit check failed', {
            error: error instanceof Error ? error.message : error,
            userId: req.userId,
        });
        next(error);
    }
};
exports.checkReviewQuota = checkReviewQuota;
const store = {};
const globalRateLimiter = (windowMs = 60000, maxRequests = 100) => {
    return (req, res, next) => {
        const key = req.ip || 'unknown';
        const now = Date.now();
        if (!store[key] || now >= store[key].resetTime) {
            store[key] = {
                count: 0,
                resetTime: now + windowMs,
            };
        }
        store[key].count += 1;
        const remaining = Math.max(0, maxRequests - store[key].count);
        res.set('X-RateLimit-Limit', String(maxRequests));
        res.set('X-RateLimit-Remaining', String(remaining));
        res.set('X-RateLimit-Reset', String(store[key].resetTime));
        if (store[key].count > maxRequests) {
            const retryAfter = Math.max(0, Math.ceil((store[key].resetTime - now) / 1000));
            res.set('Retry-After', String(retryAfter));
            logger_1.logger.warn('Global rate limit exceeded', {
                ip: key,
                maxRequests,
                windowMs,
                retryAfter,
            });
            next(new ApiError_1.RateLimitError(retryAfter, 'Too many requests from this IP'));
            return;
        }
        next();
    };
};
exports.globalRateLimiter = globalRateLimiter;
//# sourceMappingURL=rate.limit.middleware.js.map