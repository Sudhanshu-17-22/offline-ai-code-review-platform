export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: Record<string, any>
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends ApiError {
    constructor(message: string, details?: Record<string, any>) {
        super(400, message, details);
        this.name = 'ValidationError';
    }
}
export class AuthenticationError extends ApiError {
    constructor(message: string = 'Authentication required') {
        super(401, message);
        this.name = 'AuthenticationError';
    }
}
export class AuthorizationError extends ApiError {
    constructor(message: string = 'Access denied') {
        super(403, message);
        this.name = 'AuthorizationError';
    }
}
export class NotFoundError extends ApiError {
    constructor(resource: string) {
        super(404, `${resource} not found`);
        this.name = 'NotFoundError';
    }
}
export class ConflictError extends ApiError {
    constructor(message: string) {
        super(409, message);
        this.name = 'ConflictError';
    }
}
export class RateLimitError extends ApiError {
    constructor(
        public retryAfter: number,
        message: string = 'Too many requests, please try again later'
    ) {
        super(429, message);
        this.name = 'RateLimitError';
    }
}
export class InternalServerError extends ApiError {
    constructor(message: string = 'Internal server error') {
        super(500, message);
        this.name = 'InternalServerError';
    }
}
export class ServiceUnavailableError extends ApiError {
    constructor(service: string) {
        super(503, `${service} is temporarily unavailable`);
        this.name = 'ServiceUnavailableError';
    }
}
export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError;
};



