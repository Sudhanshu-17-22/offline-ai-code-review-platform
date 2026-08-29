"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@/config/db");
const models_1 = require("@/models");
const types_1 = require("@/types");
const logger_1 = require("@/utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
const testModels = async () => {
    await (0, db_1.connectDB)();
    try {
        const testUser = await models_1.User.create({
            name: "Test Student",
            email: `test${Date.now()}@example.com`,
            password: "password123",
        });
        logger_1.logger.info(`✅ User created: ${testUser.email}`);
        logger_1.logger.info(`✅ Password was hashed: ${testUser.password !== "password123"}`);
        const isMatch = await testUser.comparePassword("password123");
        logger_1.logger.info(`✅ Password comparison works: ${isMatch}`);
        const testReview = await models_1.Review.create({
            userId: testUser._id,
            title: "Sample Review",
            code: "function add(a, b) { return a + b; }",
            language: types_1.SupportedLanguage.JAVASCRIPT,
            status: types_1.ReviewStatus.PENDING,
        });
        logger_1.logger.info(`✅ Review created with ID: ${testReview._id}`);
        const populatedReview = await models_1.Review.findById(testReview._id).populate("userId", "name email");
        logger_1.logger.info(`✅ Populated review user: ${JSON.stringify(populatedReview?.userId)}`);
        await models_1.Review.findByIdAndDelete(testReview._id);
        await models_1.User.findByIdAndDelete(testUser._id);
        logger_1.logger.info("🧹 Test data cleaned up successfully");
        logger_1.logger.info("🎉 All model tests passed!");
    }
    catch (error) {
        logger_1.logger.error(`❌ Model tests failed: ${error}`);
        throw error;
    }
    finally {
        await mongoose_1.default.disconnect();
    }
};
testModels();
//# sourceMappingURL=test.model.js.map