"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("@/controllers/review.controller");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const validate_middleware_1 = require("@/middlewares/validate.middleware");
const review_validator_1 = require("@/utils/validators/review.validator");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.post("/", (0, validate_middleware_1.validate)(review_validator_1.createReviewSchema), review_controller_1.createReview);
router.get("/", review_controller_1.getUserReviews);
router.get("/:id", review_controller_1.getReviewById);
router.delete("/:id", review_controller_1.deleteReview);
exports.default = router;
//# sourceMappingURL=review.route.js.map