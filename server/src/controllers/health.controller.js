"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAiHealth = void 0;
const ollama_service_1 = require("@/services/ollama.service");
const ApiResponse_1 = require("@/utils/ApiResponse");
const async_handler_1 = require("@/utils/async.handler");
exports.checkAiHealth = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const isHealthy = await ollama_service_1.ollamaService.healthCheck();
    res.status(200).json(new ApiResponse_1.ApiResponse("AI health check complete", {
        ollamaAvailable: isHealthy,
    }));
});
//# sourceMappingURL=health.controller.js.map