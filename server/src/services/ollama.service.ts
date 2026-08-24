import axios from "axios";
import { ollamaConfig } from "@/config/ollama.config";
import { logger } from "@/utils/logger";
import { ApiError } from "@/utils/ApiError";
import { buildCodeReviewPrompt } from "../utils/prompts";
import { SupportedLanguage } from "../types";

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
    async reviewCodeStream(
        code: string,
        language: SupportedLanguage,
        onChunk: (chunk: string) => void
    ): Promise<string> {
        const prompt = buildCodeReviewPrompt(code, language);
        let fullResponse = "";

        try {
            const response = await axios.post(
                `${this.baseUrl}/api/generate`,
                {
                    model: this.model,
                    prompt,
                    stream: true,
                    options: {
                        temperature: 0.3,
                    },
                },
                {
                    responseType: "stream",
                    timeout: 120000,
                }
            );

            return new Promise((resolve, reject) => {
                response.data.on("data", (chunk: Buffer) => {
                    try {
                        const lines = chunk
                            .toString()
                            .split("\n")
                            .filter((line: string) => line.trim());

                        for (const line of lines) {
                            const json = JSON.parse(line);

                            if (json.response) {
                                fullResponse += json.response;
                                onChunk(json.response);
                            }

                            if (json.done) {
                                return;
                            }
                        }
                    } catch (parseError) {
                        return;
                    }
                });

                response.data.on("end", () => {
                    resolve(fullResponse);
                });

                response.data.on("error", (error: Error) => {
                    logger.error(`Ollama stream error: ${error.message}`);
                    reject(error);
                });
            });
        } catch (error) {
            logger.error(
                `Ollama reviewCodeStream() failed: ${(error as Error).message}`
            );

            if (axios.isAxiosError(error) && error.code === "ECONNREFUSED") {
                throw new ApiError(
                    503,
                    "AI service unavailable. Make sure Ollama is running locally."
                );
            }

            throw new ApiError(500, "Failed to stream AI response");
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



