import { z } from "zod";
import { SupportedLanguage } from "@/types";
export declare const createReviewSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    code: z.ZodString;
    language: z.ZodEnum<typeof SupportedLanguage>;
    fileName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
//# sourceMappingURL=review.validator.d.ts.map