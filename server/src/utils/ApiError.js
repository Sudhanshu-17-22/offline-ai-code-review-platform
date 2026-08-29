"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.RateLimitError = exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    isOperational;
    details;
    constructor(statusCode, message, isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
class RateLimitError extends ApiError {
    retryAfter;
    constructor(retryAfter, message = 'Too many requests, please try again later') {
        super(429, message);
        this.retryAfter = retryAfter;
    }
}
exports.RateLimitError = RateLimitError;
class ValidationError extends ApiError {
    constructor(message, details) {
        super(400, message, true, details);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ApiError.js.map