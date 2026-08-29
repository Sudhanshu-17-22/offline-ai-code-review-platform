"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTrackerService = void 0;
const logger_1 = require("../utils/logger");
const ApiError_1 = require("../utils/ApiError");
class ErrorTrackerService {
    static trackError(error, context) {
        const normalizedError = error instanceof Error ? error : new Error(String(error));
        const statusCode = normalizedError instanceof ApiError_1.ApiError
            ? normalizedError.statusCode
            : 500;
        const errorData = {
            name: normalizedError.name,
            message: normalizedError.message,
            stack: normalizedError.stack?.split('\n').slice(0, 5),
            statusCode,
            context,
            timestamp: new Date().toISOString(),
        };
        if (statusCode < 500) {
            logger_1.logger.warn('Client error', errorData);
        }
        else {
            logger_1.logger.error('Server error', errorData);
        }
    }
    static generateUserMessage(error) {
        const messages = {
            ValidationError: 'Invalid input provided. Please check your data.',
            AuthenticationError: 'Please log in to continue.',
            AuthorizationError: 'You do not have permission to perform this action.',
            NotFoundError: 'The requested resource was not found.',
            ConflictError: 'This resource already exists.',
            RateLimitError: 'You have made too many requests. Please try again later.',
            ServiceUnavailableError: 'A service is temporarily unavailable. Please try again in a moment.',
            InternalServerError: 'An internal server error occurred. Please try again.',
            MongoError: 'Database error occurred. Please try again.',
            OllamaError: 'AI service is temporarily unavailable.',
        };
        const errorName = error instanceof Error ? error.name : 'UnknownError';
        return (messages[errorName] ||
            'An unexpected error occurred. Please try again.');
    }
    static generateErrorResponse(error, context) {
        this.trackError(error, context);
        const normalizedError = error instanceof Error ? error : new Error(String(error));
        const statusCode = normalizedError instanceof ApiError_1.ApiError
            ? normalizedError.statusCode
            : 500;
        return {
            success: false,
            statusCode,
            message: this.generateUserMessage(error),
            ...(process.env.NODE_ENV === 'development' && {
                debug: {
                    error: normalizedError.message,
                    type: normalizedError.name,
                    stack: normalizedError.stack,
                },
            }),
        };
    }
    static trackSlowOperation(operationName, durationMs, threshold = 1000) {
        if (durationMs > threshold) {
            logger_1.logger.warn('Slow operation detected', {
                operation: operationName,
                durationMs,
                threshold,
                timestamp: new Date().toISOString(),
            });
        }
    }
}
exports.ErrorTrackerService = ErrorTrackerService;
//# sourceMappingURL=error.tracking.service.js.map