"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeQueryMiddleware = exports.sanitizeBodyMiddleware = exports.sanitizeCodeMiddleware = void 0;
const sanitizer_1 = require("../utils/sanitizer");
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../utils/logger");
const sanitizeCodeMiddleware = (req, res, next) => {
    try {
        if (req.body?.code !== undefined) {
            req.body.code = sanitizer_1.Sanitizer.sanitizeCode(req.body.code);
        }
        if (req.body?.language !== undefined) {
            req.body.language = sanitizer_1.Sanitizer.sanitizeLanguage(req.body.language);
        }
        if (req.body?.fileName !== undefined) {
            req.body.fileName = sanitizer_1.Sanitizer.sanitizeFilename(req.body.fileName);
        }
        next();
    }
    catch (error) {
        logger_1.logger.warn('Sanitization failed', {
            error: error instanceof Error ? error.message : error,
            path: req.path,
            method: req.method,
        });
        next(new ApiError_1.ValidationError(error instanceof Error ? error.message : 'Invalid input'));
    }
};
exports.sanitizeCodeMiddleware = sanitizeCodeMiddleware;
const sanitizeBodyMiddleware = (req, res, next) => {
    try {
        if (req.body &&
            typeof req.body === 'object' &&
            !Array.isArray(req.body)) {
            Object.keys(req.body).forEach((key) => {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = sanitizer_1.Sanitizer.sanitizeString(req.body[key]);
                }
            });
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('Body sanitization failed', {
            error: error instanceof Error ? error.message : error,
            path: req.path,
            method: req.method,
        });
        next(error);
    }
};
exports.sanitizeBodyMiddleware = sanitizeBodyMiddleware;
const sanitizeQueryMiddleware = (req, res, next) => {
    try {
        Object.assign(req.query, sanitizer_1.Sanitizer.sanitizeQuery(req.query));
        next();
    }
    catch (error) {
        logger_1.logger.error('Query sanitization failed', {
            error: error instanceof Error ? error.message : error,
            path: req.path,
            method: req.method,
        });
        next(error);
    }
};
exports.sanitizeQueryMiddleware = sanitizeQueryMiddleware;
//# sourceMappingURL=sanitize.middleware.js.map