"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.getUserReviews = exports.getReviewById = exports.createReview = void 0;
const review_model_1 = require("@/models/review.model");
const ai_service_1 = require("@/services/ai.service");
const ApiError_1 = require("@/utils/ApiError");
const ApiResponse_1 = require("@/utils/ApiResponse");
const async_handler_1 = require("@/utils/async.handler");
const types_1 = require("@/types");
const logger_1 = require("@/utils/logger");
const static_analysis_service_1 = __importDefault(require("../services/static.analysis.service"));
exports.createReview = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { title, code, language, fileName } = req.body;
    const userId = req.userId;
    if (!userId) {
        throw new ApiError_1.ApiError(401, "Authentication required");
    }
    if (!code || !language) {
        throw new ApiError_1.ApiError(400, "Code and language are required");
    }
    const review = await review_model_1.Review.create({
        userId,
        title: title || `Review - ${new Date().toLocaleDateString()}`,
        code,
        language,
        fileName: fileName || "",
        status: types_1.ReviewStatus.PROCESSING,
    });
    logger_1.logger.info(`📝 Review ${review._id} created, starting AI analysis...`);
    try {
        const startTime = Date.now();
        const aiResult = await ai_service_1.aiService.reviewCode(code, language);
        const staticAnalysis = await static_analysis_service_1.default.analyzeCode(code, language);
        const aiScore = 75;
        const staticScore = staticAnalysis.score;
        const overallScore = Math.round((aiScore + staticScore) / 2);
        const executionTimeMs = Date.now() - startTime;
        review.aiAnalysis = aiResult;
        review.aiFindings = typeof aiResult === "string"
            ? aiResult
            : JSON.stringify(aiResult);
        review.staticAnalysis = staticAnalysis;
        review.overallScore = overallScore;
        review.status = types_1.ReviewStatus.COMPLETED;
        review.executionTimeMs = executionTimeMs;
        await review.save();
        logger_1.logger.info(`✅ Review ${review._id} completed in ${executionTimeMs}ms`);
    }
    catch (error) {
        review.status = types_1.ReviewStatus.FAILED;
        await review.save();
        logger_1.logger.error(`❌ Review ${review._id} failed: ${error.message}`);
        throw new ApiError_1.ApiError(502, "Code review failed. The code was saved — you can retry from your history.");
    }
    res.status(201).json(new ApiResponse_1.ApiResponse("Review completed successfully", { review }));
});
exports.getReviewById = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const review = await review_model_1.Review.findById(req.params.id);
    if (!review) {
        throw new ApiError_1.ApiError(404, "Review not found");
    }
    if (review.userId.toString() !== req.userId) {
        throw new ApiError_1.ApiError(403, "You don't have permission to view this review");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse("Review fetched successfully", { review }));
});
exports.getUserReviews = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.userId) {
        throw new ApiError_1.ApiError(401, "Authentication required");
    }
    const userId = req.userId;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const language = req.query.language;
    const search = req.query.search;
    const sortByParam = req.query.sortBy;
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const minScore = req.query.minScore !== undefined
        ? parseInt(req.query.minScore, 10)
        : undefined;
    const maxScore = req.query.maxScore !== undefined
        ? parseInt(req.query.maxScore, 10)
        : undefined;
    const allowedSortFields = [
        "createdAt",
        "updatedAt",
        "overallScore",
        "language",
        "fileName",
    ];
    const sortBy = allowedSortFields.includes(sortByParam)
        ? sortByParam
        : "createdAt";
    const query = {
        userId,
        ...(language && language !== "all" && {
            language,
        }),
        ...(search?.trim() && {
            fileName: {
                $regex: search.trim(),
                $options: "i",
            },
        }),
        ...((minScore !== undefined || maxScore !== undefined) && {
            overallScore: {
                ...(minScore !== undefined &&
                    !Number.isNaN(minScore) && {
                    $gte: minScore,
                }),
                ...(maxScore !== undefined &&
                    !Number.isNaN(maxScore) && {
                    $lte: maxScore,
                }),
            },
        }),
    };
    const reviews = await review_model_1.Review.find(query)
        .select("fileName language overallScore staticAnalysis.score staticAnalysis.findings createdAt")
        .sort({
        [sortBy]: sortOrder,
    })
        .limit(limit)
        .skip(skip);
    const total = await review_model_1.Review.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json(new ApiResponse_1.ApiResponse("Reviews retrieved successfully", {
        reviews,
        pagination: {
            total,
            page,
            limit,
            totalPages,
        },
    }));
});
exports.deleteReview = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.userId) {
        new ApiError_1.ApiError(401, "Authentication required");
    }
    const review = await review_model_1.Review.findById(req.params.id);
    if (!review) {
        throw new ApiError_1.ApiError(404, "Review not found");
    }
    if (review.userId.toString() !== req.userId) {
        throw new ApiError_1.ApiError(403, "You don't have permission to delete this review");
    }
    await review.deleteOne();
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse("Review deleted successfully", null));
});
//# sourceMappingURL=review.controller.js.map