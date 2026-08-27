import request from "supertest";
import app from "../../app";
import { User } from "../../models/user.model";
import Review from "../../models/review.model";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

describe("Analytics API Endpoints", () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
        const user = await User.create({
            email: `analytics-${Date.now()}@example.com`,
            password: "Test@123",
            name: "Analytics User",
        });

        userId = user._id.toString();

        token = jwt.sign(
            { userId, email: user.email },
            env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        await Review.create([
            {
                userId,
                code: "test 1",
                language: "javascript",
                fileName: "test1.js",
                aiFindings: "Good",
                staticAnalysis: {
                    findings: [
                        {
                            type: "eslint",
                            severity: "warning",
                            rule: "no-unused-vars",
                            title: "Unused Variable",
                            description: "A variable is declared but never used.",
                            message: "test",
                            line: 1,
                            column: 1,
                        },
                    ],
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
                code: "test 2",
                language: "typescript",
                fileName: "test2.ts",
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
        ]);
    });

    afterEach(async () => {
        await Review.deleteMany({ userId });
        await User.findByIdAndDelete(userId);
    });

    describe("GET /api/analytics/dashboard", () => {
        it("should return dashboard statistics", async () => {
            const response = await request(app)
                .get("/api/analytics/dashboard")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty("totalReviews");
            expect(response.body.data).toHaveProperty("averageScore");
            expect(response.body.data).toHaveProperty("totalIssuesFound");
            expect(response.body.data).toHaveProperty("averageComplexity");
            expect(response.body.data.totalReviews).toBe(2);
            expect(response.body.data.averageScore).toBe(90);
        });

        it("should require authentication", async () => {
            const response = await request(app).get(
                "/api/analytics/dashboard"
            );

            expect(response.status).toBe(401);
        });
    });

    describe("GET /api/analytics/score-trend", () => {
        it("should return score trend data", async () => {
            const response = await request(app)
                .get("/api/analytics/score-trend?days=30")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);

            if (response.body.data.length > 0) {
                const dataPoint = response.body.data[0];

                expect(dataPoint).toHaveProperty("date");
                expect(dataPoint).toHaveProperty("score");
                expect(dataPoint).toHaveProperty("count");
            }
        });

        it("should accept days parameter", async () => {
            const response = await request(app)
                .get("/api/analytics/score-trend?days=7")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    describe("GET /api/analytics/languages", () => {
        it("should return language breakdown", async () => {
            const response = await request(app)
                .get("/api/analytics/languages")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);

            const languages = response.body.data.map(
                (l: any) => l.language
            );

            expect(languages).toContain("javascript");
            expect(languages).toContain("typescript");
        });
    });

    describe("GET /api/analytics/severity", () => {
        it("should return severity breakdown", async () => {
            const response = await request(app)
                .get("/api/analytics/severity")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe("GET /api/analytics/top-issues", () => {
        it("should return top issues", async () => {
            const response = await request(app)
                .get("/api/analytics/top-issues?limit=5")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);

            if (response.body.data.length > 0) {
                const issue = response.body.data[0];

                expect(issue).toHaveProperty("rule");
                expect(issue).toHaveProperty("count");
            }
        });
    });
});




