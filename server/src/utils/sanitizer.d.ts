export interface SanitizationOptions {
    allowHtml?: boolean;
    maxLength?: number;
    stripTags?: boolean;
}
export declare class Sanitizer {
    static sanitizeCode(code: string, options?: SanitizationOptions): string;
    static sanitizeQuery(obj: unknown): any;
    static sanitizeString(str: string, options?: SanitizationOptions): string;
    static sanitizeEmail(email: string): string;
    static sanitizeFilename(filename: string): string;
    static sanitizeLanguage(language: string): string;
}
//# sourceMappingURL=sanitizer.d.ts.map