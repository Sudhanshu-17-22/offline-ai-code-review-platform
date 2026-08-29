interface ErrorContext {
    userId?: string;
    requestId?: string;
    codeLength?: number;
    language?: string;
    stage?: 'submission' | 'ai_analysis' | 'static_analysis' | 'auth' | 'db';
    endpoint?: string;
    method?: string;
}
export declare class ErrorTrackerService {
    static trackError(error: unknown, context: ErrorContext): void;
    static generateUserMessage(error: unknown): string;
    static generateErrorResponse(error: unknown, context: ErrorContext): {
        debug?: {
            error: string;
            type: string;
            stack: string | undefined;
        };
        success: boolean;
        statusCode: number;
        message: string;
    };
    static trackSlowOperation(operationName: string, durationMs: number, threshold?: number): void;
}
export {};
//# sourceMappingURL=error.tracking.service.d.ts.map