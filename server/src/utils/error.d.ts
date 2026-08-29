export declare class ApiError extends Error {
    statusCode: number;
    message: string;
    details?: Record<string, any> | undefined;
    constructor(statusCode: number, message: string, details?: Record<string, any> | undefined);
}
export declare class ValidationError extends ApiError {
    constructor(message: string, details?: Record<string, any>);
}
export declare class AuthenticationError extends ApiError {
    constructor(message?: string);
}
export declare class AuthorizationError extends ApiError {
    constructor(message?: string);
}
export declare class NotFoundError extends ApiError {
    constructor(resource: string);
}
export declare class ConflictError extends ApiError {
    constructor(message: string);
}
export declare class RateLimitError extends ApiError {
    retryAfter: number;
    constructor(retryAfter: number, message?: string);
}
export declare class InternalServerError extends ApiError {
    constructor(message?: string);
}
export declare class ServiceUnavailableError extends ApiError {
    constructor(service: string);
}
export declare const isApiError: (error: unknown) => error is ApiError;
//# sourceMappingURL=error.d.ts.map