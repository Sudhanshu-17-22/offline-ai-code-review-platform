import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { ollamaService } from "../services/ollama.service";
import staticAnalysisService from "../services/static.analysis.service";
import Review from "../models/review.model";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { SupportedLanguage, ReviewStatus } from "../types";

interface AuthenticatedSocket extends Socket {
    userId?: string;
    email?: string;
}

interface ReviewStartPayload {
    code: string;
    language: SupportedLanguage;
    fileName?: string;
}

interface AiReviewResult {
    summary: string;
    correctedCode: string;
    issues: Array<{
        line: number;
        severity: "critical" | "warning" | "info";
        title: string;
        description: string;
        suggestion?: string;
    }>;
    overallScore: number;
}

export const initReviewSocket = (io: Server) => {
    io.use((socket: AuthenticatedSocket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Authentication token required"));
            }

            const decoded = jwt.verify(token, env.JWT_SECRET) as {
                userId: string;
            };

            socket.userId = decoded.userId;
            next();
        } catch (error) {
            logger.warn("Socket auth failed:", error);
            next(new Error("Invalid or expired token"));
        }
    });

    io.on("connection", (socket: AuthenticatedSocket) => {
        logger.info(
            `[Socket] User connected: ${socket.id} (${socket.email})`
        );

        socket.on("review:start", async (data: ReviewStartPayload) => {
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

                const staticAnalysis = await staticAnalysisService.analyzeCode(
                    code,
                    language
                );

                socket.emit("review:static-complete", {
                    staticAnalysis,
                    progress: 40,
                });

                logger.info(
                    `[Socket] Static analysis complete for ${socket.email}`
                );

                socket.emit("review:status", {
                    status: "streaming",
                    message: "AI is analyzing your code...",
                    progress: 50,
                });

                let chunkCount = 0;

                const aiResponse = await ollamaService.reviewCodeStream(
                    code,
                    language,
                    (chunk: string) => {
                        chunkCount++;

                        socket.emit("review:chunk", {
                            chunk,
                            chunkCount,
                            progress: 40 + Math.min(chunkCount * 0.5, 30),
                        });
                    }
                );

                logger.info(
                    `[Socket] AI streaming complete: ${chunkCount} chunks for ${socket.email}`
                );

                let aiAnalysis: AiReviewResult;

                try {
                    const cleanedResponse = aiResponse
                        .replace(/^```json\s*/i, "")
                        .replace(/^```\s*/i, "")
                        .replace(/\s*```$/i, "")
                        .trim();

                    aiAnalysis = JSON.parse(cleanedResponse);
                } catch (parseError) {
                    logger.error(
                        `[Socket] Failed to parse AI response: ${(parseError as Error).message}`
                    );
                    throw new Error("AI returned an invalid review response");
                }

                const aiScore = Math.max(
                    0,
                    Math.min(100, Number(aiAnalysis.overallScore) || 0)
                );

                const overallScore = Math.round(
                    (aiScore + staticAnalysis.score) / 2
                );

                socket.emit("review:status", {
                    status: "saving",
                    message: "Finalizing review...",
                    progress: 80,
                });

                const review = new Review({
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
                    status: ReviewStatus.COMPLETED,
                    executionTimeMs: Date.now() - startTime,
                });

                const savedReview = await review.save();

                logger.info(
                    `[Socket] Review saved: ${savedReview._id} for ${socket.email}`
                );

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
            } catch (error: any) {
                logger.error(
                    `[Socket] Review failed for ${socket.email}:`,
                    error
                );

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
            logger.info(
                `[Socket] User disconnected: ${socket.id} (${socket.email}) - ${reason}`
            );
        });
    });
};
