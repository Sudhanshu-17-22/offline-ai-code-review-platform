"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),
    email: zod_1.z.string().email("Please provide a valid email address"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password is too long"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Please provide a valid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
//# sourceMappingURL=auth.validator.js.map