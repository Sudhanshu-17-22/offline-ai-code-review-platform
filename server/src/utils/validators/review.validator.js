"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("@/types");
exports.createReviewSchema = zod_1.z.object({
    title: zod_1.z.string().max(100).optional(),
    code: zod_1.z
        .string()
        .min(1, "Code cannot be empty")
        .max(20000, "Code exceeds maximum allowed length (20,000 characters)"),
    language: zod_1.z.nativeEnum(types_1.SupportedLanguage, {
        error: "Unsupported language",
    }),
    fileName: zod_1.z.string().optional(),
});
//# sourceMappingURL=review.validator.js.map