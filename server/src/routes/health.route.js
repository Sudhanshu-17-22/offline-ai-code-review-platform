"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const health_controller_1 = require("@/controllers/health.controller");
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("@/config/env");
const router = (0, express_1.Router)();
router.get("/ai", health_controller_1.checkAiHealth);
router.get('/health', async (_req, res) => {
    const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected';
    let ollamaStatus = 'unknown';
    try {
        const response = await fetch(`${env_1.env.OLLAMA_BASE_URL}/api/tags`, {
            signal: AbortSignal.timeout(2000),
        });
        ollamaStatus = response.ok ? 'connected' : 'error';
    }
    catch {
        ollamaStatus = 'unavailable';
    }
    const healthy = dbStatus === 'connected';
    res.status(healthy ? 200 : 503).json({
        status: healthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
            database: dbStatus,
            ollama: ollamaStatus,
        },
        uptime: process.uptime(),
        environment: env_1.env.NODE_ENV,
    });
});
router.get('/', (_req, res) => {
    const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        database: dbStatus,
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=health.route.js.map