import { SupportedLanguage, IAiAnalysisResult } from "@/types";
declare class AiService {
    reviewCode(code: string, language: SupportedLanguage): Promise<IAiAnalysisResult>;
    private parseAiResponse;
    private normalizeSeverity;
}
export declare const aiService: AiService;
export {};
//# sourceMappingURL=ai.service.d.ts.map