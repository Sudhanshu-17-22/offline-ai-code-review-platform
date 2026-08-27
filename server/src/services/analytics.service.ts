import mongoose from "mongoose";
import Review from "../models/review.model";
import { logger } from "../utils/logger";

interface DashboardStats {
    totalReviews: number;
    averageScore: number;
    totalIssuesFound: number;
    averageComplexity: number;
    reviewsThisWeek: number;
    scoreImprovement: number; 
}

interface ScoreTrendPoint {
    date: string;
    score: number;
    count: number;
}

interface LanguageBreakdown {
    language: string;
    count: number;
    averageScore: number;
}

interface SeverityBreakdown {
    severity: string;
    count: number;
}

class AnalyticsService {
    async getDashboardStats(userId: string): Promise<DashboardStats> {
        try {
        const objectId = new mongoose.Types.ObjectId(userId);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const overallStats = await Review.aggregate([
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

        const reviewsThisWeek = await Review.countDocuments({
            userId: objectId,
            createdAt: { $gte: oneWeekAgo },
        });

        const thisWeekAvg = await Review.aggregate([
            {
                $match: {
                    userId: objectId,
                    createdAt: { $gte: oneWeekAgo },
                },
            },
            { $group: { _id: null, avg: { $avg: "$overallScore" } } },
        ]);

        const lastWeekAvg = await Review.aggregate([
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

        const scoreImprovement =
        lastWeekScore > 0
            ? Math.round(
                ((thisWeekScore - lastWeekScore) / lastWeekScore) * 100
                )
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
            averageComplexity:
            Math.round((stats.averageComplexity || 0) * 10) / 10,
            reviewsThisWeek,
            scoreImprovement,
        };
        } 
        catch (error) {
            logger.error("Error calculating dashboard stats:", error);
            throw new Error("Failed to calculate dashboard stats");
        }
    }

    async getScoreTrend(
        userId: string,
        days: number = 30
    ): Promise<ScoreTrendPoint[]> {
        try {
            const objectId = new mongoose.Types.ObjectId(userId);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const trend = await Review.aggregate([
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
            logger.error("Error calculating score trend:", error);
            throw new Error("Failed to calculate score trend");
        }
    }

    async getLanguageBreakdown(
        userId: string
    ): Promise<LanguageBreakdown[]> {
        try {
        const objectId = new mongoose.Types.ObjectId(userId);

        const breakdown = await Review.aggregate([
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
            logger.error("Error calculating language breakdown:", error);
            throw new Error("Failed to calculate language breakdown");
        }
    }

    async getSeverityBreakdown(
        userId: string
    ): Promise<SeverityBreakdown[]> {
        try {
            const objectId = new mongoose.Types.ObjectId(userId);

            const breakdown = await Review.aggregate([
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
            logger.error("Error calculating severity breakdown:", error);
            throw new Error("Failed to calculate severity breakdown");
        }
    }

    async getTopIssues(
        userId: string,
        limit: number = 5
    ): Promise<{ rule: string; count: number }[]> {
        try {
            const objectId = new mongoose.Types.ObjectId(userId);

            const topIssues = await Review.aggregate([
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
            logger.error("Error calculating top issues:", error);
            throw new Error("Failed to calculate top issues");
        }
    }
}
export default new AnalyticsService();




