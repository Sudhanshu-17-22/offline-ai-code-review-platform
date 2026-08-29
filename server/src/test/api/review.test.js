"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const user_model_1 = require("../../models/user.model");
const review_model_1 = __importDefault(require("../../models/review.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const ai_service_1 = require("../../services/ai.service");
const static_analysis_service_1 = __importDefault(require("../../services/static.analysis.service"));
jest.setTimeout(30000);
jest.spyOn(ai_service_1.aiService, "reviewCode").mockResolvedValue({
    summary: "Code review completed",
    issues: [],
    overallScore: 90,
});
jest.spyOn(static_analysis_service_1.default, "analyzeCode").mockResolvedValue({
    findings: [],
    metrics: {
        cyclomaticComplexity: 1,
        linesOfCode: 1,
        nestingDepth: 0,
        functions: [],
        duplicatePatterns: [],
    },
    score: 90,
});
describe("Review API Endpoints", () => {
    let token;
    let userId;
    beforeEach(async () => {
        const user = await user_model_1.User.create({
            email: `test-${Date.now()}@example.com`,
            password: "Test@123",
            name: "Test User",
        });
        userId = user._id.toString();
        token = jsonwebtoken_1.default.sign({ userId, email: user.email }, env_1.env.JWT_SECRET, {
            expiresIn: "7d",
        });
    });
    describe("POST /api/reviews", () => {
        it("should create a new review", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/reviews")
                .set("Authorization", `Bearer ${token}`)
                .send({
                code: "function test() { return 1; }",
                language: "javascript",
                fileName: "test.js",
            });
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            const reviewId = response.body.data?._id ||
                response.body.data?.review?._id;
            expect(reviewId).toBeDefined();
            expect(response.body.data?.overallScore ??
                response.body.data?.review?.overallScore).toBeDefined();
        });
        it("should reject without authentication", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/reviews")
                .send({
                code: "test",
                language: "javascript",
            });
            expect(response.status).toBe(401);
        });
        it("should validate code length", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/reviews")
                .set("Authorization", `Bearer ${token}`)
                .send({
                code: "",
                language: "javascript",
            });
            expect(response.status).toBe(400);
        });
        it("should require language field", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/reviews")
                .set("Authorization", `Bearer ${token}`)
                .send({
                code: "function test() { return 1; }",
            });
            expect(response.status).toBe(400);
        });
    });
    describe("GET /api/reviews/:id", () => {
        it("should retrieve a review by ID", async () => {
            const review = await review_model_1.default.create({
                userId,
                code: "test code",
                language: "javascript",
                fileName: "test.js",
                aiFindings: "Good code",
                staticAnalysis: {
                    findings: [],
                    metrics: {
                        cyclomaticComplexity: 1,
                        linesOfCode: 1,
                        nestingDepth: 0,
                        functions: [],
                        duplicatePatterns: [],
                    },
                    score: 80,
                },
                overallScore: 80,
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/reviews/${review._id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            const returnedReview = response.body.data?.review ||
                response.body.data;
            expect(returnedReview._id).toBeDefined();
            expect(returnedReview._id.toString()).toBe(review._id.toString());
        });
        it("should return 404 for non-existent review", async () => {
            const fakeId = "507f1f77bcf86cd799439011";
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/reviews/${fakeId}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(404);
        });
        it("should prevent accessing other user's reviews", async () => {
            const otherUser = await user_model_1.User.create({
                email: `other-${Date.now()}@example.com`,
                password: "Test@123",
                name: "Other User",
            });
            const review = await review_model_1.default.create({
                userId: otherUser._id,
                code: "private code",
                language: "javascript",
                fileName: "private.js",
                aiFindings: "Secret",
                staticAnalysis: {
                    findings: [],
                    metrics: {
                        cyclomaticComplexity: 1,
                        linesOfCode: 1,
                        nestingDepth: 0,
                        functions: [],
                        duplicatePatterns: [],
                    },
                    score: 80,
                },
                overallScore: 80,
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/reviews/${review._id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(403);
            await review_model_1.default.findByIdAndDelete(review._id);
            await user_model_1.User.findByIdAndDelete(otherUser._id);
        });
    });
    describe("GET /api/reviews", () => {
        it("should retrieve user reviews with pagination", async () => {
            await review_model_1.default.create([
                {
                    userId,
                    code: "test 1",
                    language: "javascript",
                    fileName: "test1.js",
                    aiFindings: "Good",
                    staticAnalysis: {
                        findings: [],
                        metrics: {
                            cyclomaticComplexity: 1,
                            linesOfCode: 1,
                            nestingDepth: 0,
                            functions: [],
                            duplicatePatterns: [],
                        },
                        score: 80,
                    },
                    overallScore: 80,
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
                            linesOfCode: 1,
                            nestingDepth: 0,
                            functions: [],
                            duplicatePatterns: [],
                        },
                        score: 85,
                    },
                    overallScore: 85,
                },
            ]);
            const response = await (0, supertest_1.default)(app_1.default)
                .get("/api/reviews?page=1&limit=10")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.data.reviews.length).toBe(2);
            expect(response.body.data.pagination.total).toBe(2);
        });
        it("should filter reviews by language", async () => {
            await review_model_1.default.create([
                {
                    userId,
                    code: "test 1",
                    language: "javascript",
                    fileName: "test1.js",
                    aiFindings: "Good",
                    staticAnalysis: {
                        findings: [],
                        metrics: {
                            cyclomaticComplexity: 1,
                            linesOfCode: 1,
                            nestingDepth: 0,
                            functions: [],
                            duplicatePatterns: [],
                        },
                        score: 80,
                    },
                    overallScore: 80,
                },
                {
                    userId,
                    code: "test 2",
                    language: "python",
                    fileName: "test2.py",
                    aiFindings: "Good",
                    staticAnalysis: {
                        findings: [],
                        metrics: {
                            cyclomaticComplexity: 1,
                            linesOfCode: 1,
                            nestingDepth: 0,
                            functions: [],
                            duplicatePatterns: [],
                        },
                        score: 85,
                    },
                    overallScore: 85,
                },
            ]);
            const response = await (0, supertest_1.default)(app_1.default)
                .get("/api/reviews?language=javascript")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.data.reviews.length).toBe(1);
            expect(response.body.data.reviews[0].language).toBe("javascript");
        });
        it("should filter reviews by score range", async () => {
            await review_model_1.default.create([
                {
                    userId,
                    code: "test 1",
                    language: "javascript",
                    fileName: "test1.js",
                    aiFindings: "Good",
                    staticAnalysis: {
                        findings: [],
                        metrics: {
                            cyclomaticComplexity: 1,
                            linesOfCode: 1,
                            nestingDepth: 0,
                            functions: [],
                            duplicatePatterns: [],
                        },
                        score: 60,
                    },
                    overallScore: 60,
                },
                {
                    userId,
                    code: "test 2",
                    language: "javascript",
                    fileName: "test2.js",
                    aiFindings: "Good",
                    staticAnalysis: {
                        findings: [],
                        metrics: {
                            cyclomaticComplexity: 1,
                            linesOfCode: 1,
                            nestingDepth: 0,
                            functions: [],
                            duplicatePatterns: [],
                        },
                        score: 90,
                    },
                    overallScore: 90,
                },
            ]);
            const response = await (0, supertest_1.default)(app_1.default)
                .get("/api/reviews?minScore=70&maxScore=100")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            const reviews = response.body.data.reviews;
            expect(reviews.length).toBeGreaterThanOrEqual(1);
            const highScoreReview = reviews.find((item) => item.overallScore === 90);
            expect(highScoreReview).toBeDefined();
        });
        it("should search reviews by filename", async () => {
            await review_model_1.default.create([
                {
                    userId,
                    code: "test 1",
                    language: "javascript",
                    fileName: "fibonacci.js",
                    aiFindings: "Good",
                    staticAnalysis: {
                        findings: [],
                        metrics: {
                            cyclomaticComplexity: 1,
                            linesOfCode: 1,
                            nestingDepth: 0,
                            functions: [],
                            duplicatePatterns: [],
                        },
                        score: 80,
                    },
                    overallScore: 80,
                },
                {
                    userId,
                    code: "test 2",
                    language: "javascript",
                    fileName: "quicksort.js",
                    aiFindings: "Good",
                    staticAnalysis: {
                        findings: [],
                        metrics: {
                            cyclomaticComplexity: 1,
                            linesOfCode: 1,
                            nestingDepth: 0,
                            functions: [],
                            duplicatePatterns: [],
                        },
                        score: 85,
                    },
                    overallScore: 85,
                },
            ]);
            const response = await (0, supertest_1.default)(app_1.default)
                .get("/api/reviews?search=fibonacci")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.data.reviews.length).toBe(1);
            expect(response.body.data.reviews[0].fileName).toBe("fibonacci.js");
        });
    });
    describe("DELETE /api/reviews/:id", () => {
        it("should delete a review", async () => {
            const review = await review_model_1.default.create({
                userId,
                code: "test code",
                language: "javascript",
                fileName: "test.js",
                aiFindings: "Good",
                staticAnalysis: {
                    findings: [],
                    metrics: {
                        cyclomaticComplexity: 1,
                        linesOfCode: 1,
                        nestingDepth: 0,
                        functions: [],
                        duplicatePatterns: [],
                    },
                    score: 80,
                },
                overallScore: 80,
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/reviews/${review._id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            const deletedReview = await review_model_1.default.findById(review._id);
            expect(deletedReview).toBeNull();
        });
        it("should prevent deleting other user's review", async () => {
            const otherUser = await user_model_1.User.create({
                email: `other-${Date.now()}@example.com`,
                password: "Test@123",
                name: "Other User",
            });
            const review = await review_model_1.default.create({
                userId: otherUser._id,
                code: "test",
                language: "javascript",
                fileName: "test.js",
                aiFindings: "Good",
                staticAnalysis: {
                    findings: [],
                    metrics: {
                        cyclomaticComplexity: 1,
                        linesOfCode: 1,
                        nestingDepth: 0,
                        functions: [],
                        duplicatePatterns: [],
                    },
                    score: 80,
                },
                overallScore: 80,
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/reviews/${review._id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(403);
            await review_model_1.default.findByIdAndDelete(review._id);
            await user_model_1.User.findByIdAndDelete(otherUser._id);
        });
    });
});
//# sourceMappingURL=review.test.js.map