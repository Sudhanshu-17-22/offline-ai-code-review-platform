import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import analyticsService from "../services/analytics.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

const router = Router();

router.get("/dashboard", protect, async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            throw new ApiError(401, "Not authorized.");
        }

        const stats = await analyticsService.getDashboardStats(userId);

        res.status(200).json(
            new ApiResponse("Dashboard statistics fetched successfully", stats)
        );
    } catch (error) {
        next(error);
    }
});

router.get("/score-trend", protect, async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            throw new ApiError(401, "Not authorized.");
        }

        const days = Number(req.query.days) || 30;

        const trend = await analyticsService.getScoreTrend(userId, days);

        res.status(200).json(
            new ApiResponse("Score trend fetched successfully", trend)
        );
    } catch (error) {
        next(error);
    }
});

router.get("/languages", protect, async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            throw new ApiError(401, "Not authorized.");
        }

        const breakdown =
            await analyticsService.getLanguageBreakdown(userId);

        res.status(200).json(
            new ApiResponse("Language breakdown fetched successfully", breakdown)
        );
    } catch (error) {
        next(error);
    }
});

router.get("/severity", protect, async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            throw new ApiError(401, "Not authorized.");
        }

        const breakdown =
            await analyticsService.getSeverityBreakdown(userId);

        res.status(200).json(
            new ApiResponse("Severity breakdown fetched successfully", breakdown)
        );
    } catch (error) {
        next(error);
    }
});

router.get("/top-issues", protect, async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            throw new ApiError(401, "Not authorized.");
        }

        const limit = Number(req.query.limit) || 5;

        const issues = await analyticsService.getTopIssues(userId, limit);

        res.status(200).json(
            new ApiResponse("Top issues fetched successfully", issues)
        );
    } catch (error) {
        next(error);
    }
});

export default router;




