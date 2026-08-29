export declare class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    details?: Record<string, any> | undefined;
    constructor(statusCode: number, message: string, isOperational?: boolean, details?: Record<string, any>);
}
export declare class RateLimitError extends ApiError {
    retryAfter: number;
    constructor(retryAfter: number, message?: string);
}
export declare class ValidationError extends ApiError {
    constructor(message: string, details?: Record<string, any>);
}
//# sourceMappingURL=ApiError.d.ts.map