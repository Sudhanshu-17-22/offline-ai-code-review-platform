"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.asyncHandler = exports.errorHandler = exports.addRequestId = void 0;
const ApiError_1 = require("../utils/ApiError");
const error_tracking_service_1 = require("../services/error.tracking.service");
const logger_1 = require("../utils/logger");
const addRequestId = (req, res, next) => {
    req.requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    res.setHeader('X-Request-ID', req.requestId);
    next();
};
exports.addRequestId = addRequestId;
const errorHandler = (error, req, res, next) => {
    const context = {
        ...(req.requestId !== undefined && {
            requestId: req.requestId,
        }),
        ...(req.userId !== undefined && {
            userId: req.userId,
        }),
        endpoint: req.path,
        method: req.method,
    };
    error_tracking_service_1.ErrorTrackerService.trackError(error, context);
    if (error instanceof ApiError_1.ApiError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            statusCode: error.statusCode,
            ...(process.env.NODE_ENV === 'development' && {
                details: error.details,
            }),
            requestId: req.requestId,
        });
        return;
    }
    logger_1.logger.error('Unhandled error', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...context,
    });
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        statusCode: 500,
        requestId: req.requestId,
        ...(process.env.NODE_ENV === 'development' && {
            debug: error.message,
        }),
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`,
        statusCode: 404,
        requestId: req.requestId,
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map