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
const types_1 = require("../types");
const initReviewSocket = (io) => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Authentication token required"));
            }
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            socket.userId = decoded.userId;
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
            if (!code || code.trim().length < 10) {
                socket.emit("review:error", {
                    message: "Code must be at least 10 characters",
                });
                return;
            }
            if (!language) {
                socket.emit("review:error", {
                    message: "Language is required",
                });
                return;
            }
            if (!socket.userId) {
                socket.emit("review:error", {
                    message: "Authentication required",
                });
                return;
            }
            const startTime = Date.now();
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
                let chunkCount = 0;
                const aiResponse = await ollama_service_1.ollamaService.reviewCodeStream(code, language, (chunk) => {
                    chunkCount++;
                    socket.emit("review:chunk", {
                        chunk,
                        chunkCount,
                        progress: 40 + Math.min(chunkCount * 0.5, 30),
                    });
                });
                logger_1.logger.info(`[Socket] AI streaming complete: ${chunkCount} chunks for ${socket.email}`);
                let aiAnalysis;
                try {
                    const cleanedResponse = aiResponse
                        .replace(/^```json\s*/i, "")
                        .replace(/^```\s*/i, "")
                        .replace(/\s*```$/i, "")
                        .trim();
                    aiAnalysis = JSON.parse(cleanedResponse);
                }
                catch (parseError) {
                    logger_1.logger.error(`[Socket] Failed to parse AI response: ${parseError.message}`);
                    throw new Error("AI returned an invalid review response");
                }
                const aiScore = Math.max(0, Math.min(100, Number(aiAnalysis.overallScore) || 0));
                const overallScore = Math.round((aiScore + staticAnalysis.score) / 2);
                socket.emit("review:status", {
                    status: "saving",
                    message: "Finalizing review...",
                    progress: 80,
                });
                const review = new review_model_1.default({
                    userId: socket.userId,
                    title: fileName || "Untitled Review",
                    code,
                    language,
                    fileName: fileName || "",
                    aiFindings: JSON.stringify(aiAnalysis.issues || []),
                    aiAnalysis: {
                        summary: aiAnalysis.summary || "",
                        correctedCode: aiAnalysis.correctedCode || "",
                        issues: aiAnalysis.issues || [],
                        overallScore: aiScore,
                    },
                    staticAnalysis,
                    overallScore,
                    status: types_1.ReviewStatus.COMPLETED,
                    executionTimeMs: Date.now() - startTime,
                });
                const savedReview = await review.save();
                logger_1.logger.info(`[Socket] Review saved: ${savedReview._id} for ${socket.email}`);
                socket.emit("review:complete", {
                    reviewId: savedReview._id.toString(),
                    overallScore,
                    staticScore: staticAnalysis.score,
                    aiScore,
                    progress: 100,
                    message: "Review completed successfully",
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
                    message: error.message || "Review failed",
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