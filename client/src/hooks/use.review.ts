"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createReview } from "@/libraries/review";
import { SupportedLanguage } from "@/types";

interface SubmitReviewParams {
    code: string;
    language: SupportedLanguage;
    title?: string;
    fileName?: string;
}

export const useReview = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const submitReview = async (params: SubmitReviewParams) => {
        setIsSubmitting(true);
        try {
        const review = await createReview(params);
        toast.success("Review completed!");
        router.push(`/review/${review._id}`);
        } catch (error) {
        toast.error((error as Error).message);
        } finally {
        setIsSubmitting(false);
        }
    };

    return { submitReview, isSubmitting };
};


