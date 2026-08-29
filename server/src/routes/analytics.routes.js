"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const analytics_service_1 = __importDefault(require("../services/analytics.service"));
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const router = (0, express_1.Router)();
router.get("/dashboard", auth_middleware_1.protect, async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new ApiError_1.ApiError(401, "Not authorized.");
        }
        const stats = await analytics_service_1.default.getDashboardStats(userId);
        res.status(200).json(new ApiResponse_1.ApiResponse("Dashboard statistics fetched successfully", stats));
    }
    catch (error) {
        next(error);
    }
});
router.get("/score-trend", auth_middleware_1.protect, async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new ApiError_1.ApiError(401, "Not authorized.");
        }
        const days = Number(req.query.days) || 30;
        const trend = await analytics_service_1.default.getScoreTrend(userId, days);
        res.status(200).json(new ApiResponse_1.ApiResponse("Score trend fetched successfully", trend));
    }
    catch (error) {
        next(error);
    }
});
router.get("/languages", auth_middleware_1.protect, async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new ApiError_1.ApiError(401, "Not authorized.");
        }
        const breakdown = await analytics_service_1.default.getLanguageBreakdown(userId);
        res.status(200).json(new ApiResponse_1.ApiResponse("Language breakdown fetched successfully", breakdown));
    }
    catch (error) {
        next(error);
    }
});
router.get("/severity", auth_middleware_1.protect, async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new ApiError_1.ApiError(401, "Not authorized.");
        }
        const breakdown = await analytics_service_1.default.getSeverityBreakdown(userId);
        res.status(200).json(new ApiResponse_1.ApiResponse("Severity breakdown fetched successfully", breakdown));
    }
    catch (error) {
        next(error);
    }
});
router.get("/top-issues", auth_middleware_1.protect, async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new ApiError_1.ApiError(401, "Not authorized.");
        }
        const limit = Number(req.query.limit) || 5;
        const issues = await analytics_service_1.default.getTopIssues(userId, limit);
        res.status(200).json(new ApiResponse_1.ApiResponse("Top issues fetched successfully", issues));
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map