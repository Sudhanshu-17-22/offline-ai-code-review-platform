import { z } from "zod";
import { SupportedLanguage } from "@/types";

export const createReviewSchema = z.object({
    title: z.string().max(100).optional(),
    code: z
        .string()
        .min(1, "Code cannot be empty")
        .max(20000, "Code exceeds maximum allowed length (20,000 characters)"),
    language: z.nativeEnum(SupportedLanguage, {
        error: "Unsupported language",
    }),
    fileName: z.string().optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;



