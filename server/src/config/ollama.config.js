"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaConfig = void 0;
exports.ollamaConfig = {
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "qwen2.5-coder:7b",
    timeout: 120000,
};
//# sourceMappingURL=ollama.config.js.map