"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const review_model_1 = __importDefault(require("../models/review.model"));
const logger_1 = require("../utils/logger");
class AnalyticsService {
    async getDashboardStats(userId) {
        try {
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            const overallStats = await review_model_1.default.aggregate([
                { $match: { userId: objectId } },
                {
                    $group: {
                        _id: null,
                        totalReviews: { $sum: 1 },
                        averageScore: { $avg: "$overallScore" },
                        averageComplexity: {
                            $avg: "$staticAnalysis.metrics.cyclomaticComplexity",
                        },
                        totalIssuesFound: {
                            $sum: { $size: { $ifNull: ["$staticAnalysis.findings", []] } },
                        },
                    },
                },
            ]);
            const reviewsThisWeek = await review_model_1.default.countDocuments({
                userId: objectId,
                createdAt: { $gte: oneWeekAgo },
            });
            const thisWeekAvg = await review_model_1.default.aggregate([
                {
                    $match: {
                        userId: objectId,
                        createdAt: { $gte: oneWeekAgo },
                    },
                },
                { $group: { _id: null, avg: { $avg: "$overallScore" } } },
            ]);
            const lastWeekAvg = await review_model_1.default.aggregate([
                {
                    $match: {
                        userId: objectId,
                        createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
                    },
                },
                { $group: { _id: null, avg: { $avg: "$overallScore" } } },
            ]);
            const thisWeekScore = thisWeekAvg[0]?.avg || 0;
            const lastWeekScore = lastWeekAvg[0]?.avg || 0;
            const scoreImprovement = lastWeekScore > 0
                ? Math.round(((thisWeekScore - lastWeekScore) / lastWeekScore) * 100)
                : 0;
            const stats = overallStats[0] || {
                totalReviews: 0,
                averageScore: 0,
                averageComplexity: 0,
                totalIssuesFound: 0,
            };
            return {
                totalReviews: stats.totalReviews,
                averageScore: Math.round(stats.averageScore || 0),
                totalIssuesFound: stats.totalIssuesFound,
                averageComplexity: Math.round((stats.averageComplexity || 0) * 10) / 10,
                reviewsThisWeek,
                scoreImprovement,
            };
        }
        catch (error) {
            logger_1.logger.error("Error calculating dashboard stats:", error);
            throw new Error("Failed to calculate dashboard stats");
        }
    }
    async getScoreTrend(userId, days = 30) {
        try {
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const trend = await review_model_1.default.aggregate([
                {
                    $match: {
                        userId: objectId,
                        createdAt: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                        },
                        score: { $avg: "$overallScore" },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        score: { $round: ["$score", 0] },
                        count: 1,
                    },
                },
            ]);
            return trend;
        }
        catch (error) {
            logger_1.logger.error("Error calculating score trend:", error);
            throw new Error("Failed to calculate score trend");
        }
    }
    async getLanguageBreakdown(userId) {
        try {
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            const breakdown = await review_model_1.default.aggregate([
                { $match: { userId: objectId } },
                {
                    $group: {
                        _id: "$language",
                        count: { $sum: 1 },
                        averageScore: { $avg: "$overallScore" },
                    },
                },
                { $sort: { count: -1 } },
                {
                    $project: {
                        _id: 0,
                        language: "$_id",
                        count: 1,
                        averageScore: { $round: ["$averageScore", 0] },
                    },
                },
            ]);
            return breakdown;
        }
        catch (error) {
            logger_1.logger.error("Error calculating language breakdown:", error);
            throw new Error("Failed to calculate language breakdown");
        }
    }
    async getSeverityBreakdown(userId) {
        try {
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            const breakdown = await review_model_1.default.aggregate([
                { $match: { userId: objectId } },
                { $unwind: "$staticAnalysis.findings" },
                {
                    $group: {
                        _id: "$staticAnalysis.findings.severity",
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        severity: "$_id",
                        count: 1,
                    },
                },
            ]);
            return breakdown;
        }
        catch (error) {
            logger_1.logger.error("Error calculating severity breakdown:", error);
            throw new Error("Failed to calculate severity breakdown");
        }
    }
    async getTopIssues(userId, limit = 5) {
        try {
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            const topIssues = await review_model_1.default.aggregate([
                { $match: { userId: objectId } },
                { $unwind: "$staticAnalysis.findings" },
                {
                    $group: {
                        _id: "$staticAnalysis.findings.rule",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: limit },
                {
                    $project: {
                        _id: 0,
                        rule: "$_id",
                        count: 1,
                    },
                },
            ]);
            return topIssues;
        }
        catch (error) {
            logger_1.logger.error("Error calculating top issues:", error);
            throw new Error("Failed to calculate top issues");
        }
    }
}
exports.default = new AnalyticsService();
//# sourceMappingURL=analytics.service.js.map