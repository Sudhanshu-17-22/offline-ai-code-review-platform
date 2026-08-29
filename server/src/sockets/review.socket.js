"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initReviewSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ollama_service_1 = require("../services/ollama.service");
const static_analysis_service_1 = __importDefault(require("../services/static.analysis.service"));
const review_model_1 = __importDefault(require("../models/review.model"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const initReviewSocket = (io) => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Authentication token required"));
            }
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            socket.userId = decoded.id;
            socket.email = decoded.email;
            next();
        }
        catch (error) {
            logger_1.logger.warn("Socket auth failed:", error);
            next(new Error("Invalid or expired token"));
        }
    });
    io.on("connection", (socket) => {
        logger_1.logger.info(`[Socket] User connected: ${socket.id} (${socket.email})`);
        socket.on("review:start", async (data) => {
            const { code, language, fileName } = data;
            logger_1.logger.info(`[Socket] Review started by ${socket.email}: ${fileName || "untitled"}`);
            if (!code || code.trim().length < 10) {
                socket.emit("review:error", {
                    message: "Code must be at least 10 characters",
                });
                return;
            }
            if (!language) {
                socket.emit("review:error", { message: "Language is required" });
                return;
            }
            try {
                socket.emit("review:status", {
                    status: "analyzing",
                    message: "Running static analysis...",
                    progress: 20,
                });
                const staticAnalysis = await static_analysis_service_1.default.analyzeCode(code, language);
                socket.emit("review:static-complete", {
                    staticAnalysis,
                    progress: 40,
                });
                logger_1.logger.info(`[Socket] Static analysis complete for ${socket.email}`);
                socket.emit("review:status", {
                    status: "streaming",
                    message: "AI is analyzing your code...",
                    progress: 50,
                });
                let fullAiResponse = "";
                let chunkCount = 0;
                const aiResponse = await ollama_service_1.ollamaService.reviewCodeStream(code, language, (chunk) => {
                    fullAiResponse += chunk;
                    chunkCount++;
                    socket.emit("review:chunk", {
                        chunk,
                        chunkCount,
                        progress: 40 + Math.min(chunkCount * 0.5, 30), // Progress up to 70%
                    });
                });
                logger_1.logger.info(`[Socket] AI streaming complete: ${chunkCount} chunks for ${socket.email}`);
                socket.emit("review:status", {
                    status: "saving",
                    message: "Finalizing review...",
                    progress: 80,
                });
                const aiScore = 75;
                const overallScore = Math.round((aiScore + staticAnalysis.score) / 2);
                const review = new review_model_1.default({
                    userId: socket.userId,
                    code,
                    language,
                    fileName,
                    aiFindings: aiResponse,
                    staticAnalysis,
                    overallScore,
                });
                const savedReview = await review.save();
                logger_1.logger.info(`[Socket] Review saved: ${savedReview._id} for ${socket.email}`);
                socket.emit("review:complete", {
                    reviewId: savedReview._id,
                    overallScore,
                    staticScore: staticAnalysis.score,
                    aiScore,
                    progress: 100,
                    message: "✓ Review completed successfully",
                });
                socket.emit("review:status", {
                    status: "complete",
                    message: "Review completed",
                    progress: 100,
                });
            }
            catch (error) {
                logger_1.logger.error(`[Socket] Review failed for ${socket.email}:`, error);
                socket.emit("review:error", {
                    message: error.message || "Review failed. Please try again.",
                });
                socket.emit("review:status", {
                    status: "error",
                    message: error.message,
                    progress: 0,
                });
            }
        });
        socket.on("disconnect", (reason) => {
            logger_1.logger.info(`[Socket] User disconnected: ${socket.id} (${socket.email}) - ${reason}`);
        });
    });
};
exports.initReviewSocket = initReviewSocket;
//# sourceMappingURL=review.socket.js.map