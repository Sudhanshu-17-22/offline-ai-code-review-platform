import axios from "axios";
import { ollamaConfig } from "@/config/ollama.config";
import { logger } from "@/utils/logger";
import { ApiError } from "@/utils/ApiError";

interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
}


class OllamaService {
    private baseUrl: string;
    private model: string;

    constructor() {
        this.baseUrl = ollamaConfig.baseUrl;
        this.model = ollamaConfig.model;
    }
    async generate(prompt: string): Promise<string> {
        try {
        const response = await axios.post<OllamaGenerateResponse>(
            `${this.baseUrl}/api/generate`,
            {
            model: this.model,
            prompt,
            stream: false,
            options: {
                temperature: 0.3, 
            },
            },
            {
            timeout: ollamaConfig.timeout,
            }
        );
        return response.data.response;
        } catch (error) {
        logger.error(`Ollama generate() failed: ${(error as Error).message}`);

        if (axios.isAxiosError(error) && error.code === "ECONNREFUSED") {
            throw new ApiError(
            503,
            "AI service unavailable. Make sure Ollama is running locally (run 'ollama serve')."
            );
        }

        throw new ApiError(500, "Failed to generate AI response");
        }
    }
    async healthCheck(): Promise<boolean> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/tags`, {
                timeout: 5000,
            });
            const models = response.data.models || [];
            const modelName = this.model.split(":")[0] ?? this.model;

            const modelExists = models.some((m: { name: string }) =>
            m.name.startsWith(modelName)
            );
            if (!modelExists) {
                logger.warn(
                `⚠️  Configured model "${this.model}" not found in Ollama. Run: ollama pull ${this.model}`
                );
            }
            return true;
        } 
        catch {
        return false;
        }
    }
}
export const ollamaService = new OllamaService();



