import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { ollamaService } from "../services/ollama.service";
import staticAnalysisService from "../services/static.analysis.service";
import Review from "../models/review.model";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { SupportedLanguage } from "../types";

interface AuthenticatedSocket extends Socket {
    userId?: string;
    email?: string;
}

interface ReviewStartPayload {
    code: string;
    language: SupportedLanguage;
    fileName?: string;
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
        } 
        catch (error) {
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

        logger.info(
            `[Socket] User connected: ${socket.id} (${socket.email})`
        );

        if (!code || code.trim().length < 10) {
                socket.emit("review:error", 
                {
                    message: "Code must be at least 10 characters",
                }
            );
            return;
        }

        if (!language) {
                socket.emit("review:error", { message: "Language is required" });
                return;
        }

        try {
            socket.emit("review:status", 
                {
                    status: "analyzing",
                    message: "Running static analysis...",
                    progress: 20,
                }
            );

            const staticAnalysis = await staticAnalysisService.analyzeCode(
            code,
            language
            );

            socket.emit("review:static-complete", {
                staticAnalysis,
                progress: 40,
            });

            logger.info(`[Socket] Static analysis complete for ${socket.email}`);

            socket.emit("review:status", {
                status: "streaming",
                message: "AI is analyzing your code...",
                progress: 50,
            });

            let fullAiResponse = "";
            let chunkCount = 0;

            const aiResponse = await ollamaService.reviewCodeStream(
            code,
            language,
            (chunk: string) => {
                fullAiResponse += chunk;
                chunkCount++;

                socket.emit("review:chunk", {
                    chunk,
                    chunkCount,
                    progress: 40 + Math.min(chunkCount * 0.5, 30), // Progress up to 70%
                });
            }
            );

            logger.info(
                `[Socket] AI streaming complete: ${chunkCount} chunks for ${socket.email}`
            );

            socket.emit("review:status", {
                status: "saving",
                message: "Finalizing review...",
                progress: 80,
            });


            const savedReview = await review.save();

            logger.info(
                `[Socket] Review saved: ${savedReview._id} for ${socket.email}`
            );

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
        catch (error: any) {
            logger.error(`[Socket] Review failed for ${socket.email}:`, error);
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
            logger.info(
                `[Socket] User disconnected: ${socket.id} (${socket.email}) - ${reason}`
            );
        });
    });
};