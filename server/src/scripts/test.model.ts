import { connectDB } from "@/config/db";
import { User, Review } from "@/models";
import { SupportedLanguage, ReviewStatus } from "@/types";
import { logger } from "@/utils/logger";
import mongoose from "mongoose";

const testModels = async (): Promise<void> => {
  await connectDB();

  try {
    const testUser = await User.create({
      name: "Test Student",
      email: `test${Date.now()}@example.com`,
      password: "password123",
    });

    logger.info(`✅ User created: ${testUser.email}`);
    logger.info(
      `✅ Password was hashed: ${testUser.password !== "password123"}`
    );

    const isMatch = await testUser.comparePassword("password123");
    logger.info(`✅ Password comparison works: ${isMatch}`);

    const testReview = await Review.create({
      userId: testUser._id,
      title: "Sample Review",
      code: "function add(a, b) { return a + b; }",
      language: SupportedLanguage.JAVASCRIPT,
      status: ReviewStatus.PENDING,
    });

    logger.info(`✅ Review created with ID: ${testReview._id}`);

    const populatedReview = await Review.findById(testReview._id).populate(
      "userId",
      "name email"
    );

    logger.info(
      `✅ Populated review user: ${JSON.stringify(populatedReview?.userId)}`
    );

    await Review.findByIdAndDelete(testReview._id);
    await User.findByIdAndDelete(testUser._id);

    logger.info("🧹 Test data cleaned up successfully");
    logger.info("🎉 All model tests passed!");
  } catch (error) {
    logger.error(`❌ Model tests failed: ${error}`);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
};

testModels();


