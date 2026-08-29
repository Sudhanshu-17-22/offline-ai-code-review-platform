"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaService = void 0;
const axios_1 = __importDefault(require("axios"));
const ollama_config_1 = require("@/config/ollama.config");
const logger_1 = require("@/utils/logger");
const ApiError_1 = require("@/utils/ApiError");
const prompts_1 = require("../utils/prompts");
class OllamaService {
    baseUrl;
    model;
    constructor() {
        this.baseUrl = ollama_config_1.ollamaConfig.baseUrl;
        this.model = ollama_config_1.ollamaConfig.model;
    }
    async generate(prompt) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt,
                stream: false,
                options: {
                    temperature: 0.3,
                },
            }, {
                timeout: ollama_config_1.ollamaConfig.timeout,
            });
            return response.data.response;
        }
        catch (error) {
            logger_1.logger.error(`Ollama generate() failed: ${error.message}`);
            if (axios_1.default.isAxiosError(error) && error.code === "ECONNREFUSED") {
                throw new ApiError_1.ApiError(503, "AI service unavailable. Make sure Ollama is running locally (run 'ollama serve').");
            }
            throw new ApiError_1.ApiError(500, "Failed to generate AI response");
        }
    }
    async reviewCodeStream(code, language, onChunk) {
        const prompt = (0, prompts_1.buildCodeReviewPrompt)(code, language);
        let fullResponse = "";
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt,
                stream: true,
                options: {
                    temperature: 0.3,
                },
            }, {
                responseType: "stream",
                timeout: 120000,
            });
            return new Promise((resolve, reject) => {
                response.data.on("data", (chunk) => {
                    try {
                        const lines = chunk
                            .toString()
                            .split("\n")
                            .filter((line) => line.trim());
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
                    }
                    catch (parseError) {
                        return;
                    }
                });
                response.data.on("end", () => {
                    resolve(fullResponse);
                });
                response.data.on("error", (error) => {
                    logger_1.logger.error(`Ollama stream error: ${error.message}`);
                    reject(error);
                });
            });
        }
        catch (error) {
            logger_1.logger.error(`Ollama reviewCodeStream() failed: ${error.message}`);
            if (axios_1.default.isAxiosError(error) && error.code === "ECONNREFUSED") {
                throw new ApiError_1.ApiError(503, "AI service unavailable. Make sure Ollama is running locally.");
            }
            throw new ApiError_1.ApiError(500, "Failed to stream AI response");
        }
    }
    async healthCheck() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/api/tags`, {
                timeout: 5000,
            });
            const models = response.data.models || [];
            const modelName = this.model.split(":")[0] ?? this.model;
            const modelExists = models.some((m) => m.name.startsWith(modelName));
            if (!modelExists) {
                logger_1.logger.warn(`⚠️  Configured model "${this.model}" not found in Ollama. Run: ollama pull ${this.model}`);
            }
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.ollamaService = new OllamaService();
//# sourceMappingURL=ollama.service.js.map