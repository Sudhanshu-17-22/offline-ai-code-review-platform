import { Request, Response, NextFunction } from "express";
import { Review } from "@/models/review.model";
import { aiService } from "@/services/ai.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/async.handler";
import { ReviewStatus } from "@/types";
import { CreateReviewInput } from "@/utils/validators/review.validator";
import { logger } from "@/utils/logger";
import staticAnalysisService from "../services/static.analysis.service";

interface ReviewRequest extends Request {
    user?: { id: string };
    body: {
        code: string;
        language: string;
        fileName?: string;
    };
}

export const createReview = asyncHandler(
    async (req: Request<{}, {}, CreateReviewInput>, res: Response): Promise<void> => {
        const { title, code, language, fileName } = req.body;
        const userId = req.userId;

        if (!userId) {
            throw new ApiError(401, "Authentication required");
        }
        if (!code || !language) { 
            throw new ApiError(400, "Code and language are required"); 
        }
        const review = await Review.create({
            userId,
            title: title || `Review - ${new Date().toLocaleDateString()}`,
            code,
            language,
            fileName: fileName || "",
            status: ReviewStatus.PROCESSING,
        });
        logger.info(`📝 Review ${review._id} created, starting AI analysis...`);

        try {
            const startTime = Date.now();
            const aiResult = await aiService.reviewCode(code, language);
            
            const staticAnalysis = await staticAnalysisService.analyzeCode(code, language);
            const aiScore = 75; // TODO: Extract actual score from AI result
            const staticScore = staticAnalysis.score;
            const overallScore = Math.round((aiScore + staticScore) / 2);

            const executionTimeMs = Date.now() - startTime;

            review.aiAnalysis = aiResult;
            review.aiFindings = typeof aiResult === "string" 
                ? aiResult 
                : JSON.stringify(aiResult);
            review.staticAnalysis = staticAnalysis;
            review.overallScore = overallScore;
            review.status = ReviewStatus.COMPLETED;
            review.executionTimeMs = executionTimeMs;
            await review.save();

            logger.info(`✅ Review ${review._id} completed in ${executionTimeMs}ms`);
        } 
        catch (error) {
            review.status = ReviewStatus.FAILED;
            await review.save();
            logger.error(`❌ Review ${review._id} failed: ${(error as Error).message}`);

            throw new ApiError(
                502,
                "Code review failed. The code was saved — you can retry from your history."
            );
        }
        res.status(201).json(new ApiResponse("Review completed successfully", { review }));
    }
);

export const getReviewById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const review = await Review.findById(req.params.id);

        if (!review) {
        throw new ApiError(404, "Review not found");
        }

        if (review.userId.toString() !== req.userId) {
        throw new ApiError(403, "You don't have permission to view this review");
        }
        res.status(200).json(new ApiResponse("Review fetched successfully", { review }));
    }
);

export const getUserReviews = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.userId) {
            throw new ApiError(401, "Authentication required");
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            Review.find({ userId: req.userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-code"),

            Review.countDocuments({ userId: req.userId }),
        ]);

        res.status(200).json(
            new ApiResponse("Reviews fetched successfully", {
                reviews,
                pagination: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                },
            })
        );
    }
);

export const deleteReview = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.userId) {
             new ApiError(401, "Authentication required");
        }

        const review = await Review.findById(req.params.id);
        if (!review) {
        throw new ApiError(404, "Review not found");
        }

        if (review.userId.toString() !== req.userId) {
            throw new ApiError(
                403,
                "You don't have permission to delete this review"
            );
        }
        await review.deleteOne();

        res
        .status(200)
        .json(new ApiResponse("Review deleted successfully", null));
    }
);







