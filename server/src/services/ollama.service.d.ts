import { SupportedLanguage } from "../types";
declare class OllamaService {
    private baseUrl;
    private model;
    constructor();
    generate(prompt: string): Promise<string>;
    reviewCodeStream(code: string, language: SupportedLanguage, onChunk: (chunk: string) => void): Promise<string>;
    healthCheck(): Promise<boolean>;
}
export declare const ollamaService: OllamaService;
export {};
//# sourceMappingURL=ollama.service.d.ts.map