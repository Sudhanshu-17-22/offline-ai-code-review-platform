import { Router } from "express";
import { registerUser, loginUser, getCurrentUser } from "@/controllers/auth.controller";
import { validate } from "@/middlewares/validate.middleware";
import { protect } from "@/middlewares/auth.middleware";
import { registerSchema, loginSchema } from "@/utils/validators/auth.validator";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", protect, getCurrentUser);

export default router;


