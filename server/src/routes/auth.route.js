"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("@/controllers/auth.controller");
const validate_middleware_1 = require("@/middlewares/validate.middleware");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const auth_validator_1 = require("@/utils/validators/auth.validator");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_middleware_1.validate)(auth_validator_1.registerSchema), auth_controller_1.registerUser);
router.post("/login", (0, validate_middleware_1.validate)(auth_validator_1.loginSchema), auth_controller_1.loginUser);
router.get("/me", auth_middleware_1.protect, auth_controller_1.getCurrentUser);
exports.default = router;
//# sourceMappingURL=auth.route.js.map