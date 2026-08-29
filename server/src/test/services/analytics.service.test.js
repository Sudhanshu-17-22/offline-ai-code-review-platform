"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const review_model_1 = __importDefault(require("../../models/review.model"));
const analytics_service_1 = __importDefault(require("../../services/analytics.service"));
describe("Analytics Service", () => {
    let userId;
    beforeEach(async () => {
        userId = new mongoose_1.default.Types.ObjectId();
        const reviews = [
            {
                userId,
                code: "test code 1",
                language: "javascript",
                fileName: "test1.js",
                aiFindings: "Good",
                staticAnalysis: {
                    findings: [],
                    metrics: {
                        cyclomaticComplexity: 2,
                        linesOfCode: 10,
                        nestingDepth: 1,
                        functions: [],
                        duplicatePatterns: [],
                    },
                    score: 85,
                },
                overallScore: 85,
            },
            {
                userId,
                code: "test code 2",
                language: "typescript",
                fileName: "test2.ts",
                aiFindings: "Good",
                staticAnalysis: {
                    findings: [],
                    metrics: {
                        cyclomaticComplexity: 3,
                        linesOfCode: 15,
                        nestingDepth: 2,
                        functions: [],
                        duplicatePatterns: [],
                    },
                    score: 75,
                },
                overallScore: 75,
            },
            {
                userId,
                code: "test code 3",
                language: "javascript",
                fileName: "test3.js",
                aiFindings: "Good",
                staticAnalysis: {
                    findings: [],
                    metrics: {
                        cyclomaticComplexity: 1,
                        linesOfCode: 5,
                        nestingDepth: 0,
                        functions: [],
                        duplicatePatterns: [],
                    },
                    score: 95,
                },
                overallScore: 95,
            },
        ];
        await review_model_1.default.insertMany(reviews);
    });
    describe("getDashboardStats", () => {
        it("should calculate correct dashboard statistics", async () => {
            const stats = await analytics_service_1.default.getDashboardStats(userId.toString());
            expect(stats.totalReviews).toBe(3);
            expect(stats.averageScore).toBe(85);
            expect(stats.totalIssuesFound).toBe(0);
            expect(stats.averageComplexity).toBeGreaterThan(0);
        });
        it("should return 0 stats for user with no reviews", async () => {
            const newUserId = new mongoose_1.default.Types.ObjectId();
            const stats = await analytics_service_1.default.getDashboardStats(newUserId.toString());
            expect(stats.totalReviews).toBe(0);
            expect(stats.averageScore).toBe(0);
        });
    });
    describe("getScoreTrend", () => {
        it("should return score trend data", async () => {
            const trend = await analytics_service_1.default.getScoreTrend(userId.toString(), 30);
            expect(Array.isArray(trend)).toBe(true);
            expect(trend.length).toBeGreaterThan(0);
            expect(trend[0]).toHaveProperty("date");
            expect(trend[0]).toHaveProperty("score");
            expect(trend[0]).toHaveProperty("count");
        });
    });
    describe("getLanguageBreakdown", () => {
        it("should group reviews by language", async () => {
            const breakdown = await analytics_service_1.default.getLanguageBreakdown(userId.toString());
            expect(Array.isArray(breakdown)).toBe(true);
            const languages = breakdown.map((b) => b.language);
            expect(languages).toContain("javascript");
            expect(languages).toContain("typescript");
        });
        it("should calculate correct language stats", async () => {
            const breakdown = await analytics_service_1.default.getLanguageBreakdown(userId.toString());
            const jsData = breakdown.find((b) => b.language === "javascript");
            expect(jsData?.count).toBe(2);
            expect(jsData?.averageScore).toBe(90);
        });
    });
    describe("getTopIssues", () => {
        it("should return top issues list", async () => {
            const reviewWithIssues = new review_model_1.default({
                userId,
                code: "test",
                language: "javascript",
                fileName: "issues.js",
                aiFindings: "Has issues",
                staticAnalysis: {
                    findings: [
                        {
                            type: "eslint",
                            severity: "warning",
                            rule: "no-unused-vars",
                            message: "test",
                            title: "Unused variable",
                            description: "A variable is declared but never used.",
                            line: 1,
                            column: 1,
                        },
                    ],
                    metrics: {
                        cyclomaticComplexity: 1,
                        linesOfCode: 1,
                        nestingDepth: 0,
                        functions: [],
                        duplicatePatterns: [],
                    },
                    score: 70,
                },
                overallScore: 70,
            });
            await reviewWithIssues.save();
            const topIssues = await analytics_service_1.default.getTopIssues(userId.toString(), 5);
            expect(Array.isArray(topIssues)).toBe(true);
            if (topIssues.length > 0) {
                expect(topIssues[0]).toHaveProperty("rule");
                expect(topIssues[0]).toHaveProperty("count");
            }
        });
    });
});
//# sourceMappingURL=analytics.service.test.js.map