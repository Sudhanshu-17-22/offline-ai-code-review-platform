import { Router } from "express";
import { createReview, getReviewById, getUserReviews, deleteReview } from "@/controllers/review.controller";
import { protect } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { createReviewSchema } from "@/utils/validators/review.validator";

const router = Router();
router.use(protect);

router.post("/", validate(createReviewSchema), createReview);
router.get("/", getUserReviews);
router.get("/:id", getReviewById);
router.delete("/:id", deleteReview);

export default router;


