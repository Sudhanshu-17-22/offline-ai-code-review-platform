import api from "@/libraries/api";
import { ReviewData, PaginationData, ApiResponse, SupportedLanguage } from "@/types";

interface CreateReviewPayload {
    title?: string;
    code: string;
    language: SupportedLanguage;
    fileName?: string;
}

export const createReview = async (
    payload: CreateReviewPayload
): Promise<ReviewData> => {
    const response = await api.post<ApiResponse<{ review: ReviewData }>>(
        "/reviews",
        payload
    );
    return response.data.data!.review;
};

export const getReviewById = async (id: string): Promise<ReviewData> => {
    const response = await api.get<ApiResponse<{ review: ReviewData }>>(
        `/reviews/${id}`
    );
    return response.data.data!.review;
};

export const getUserReviews = async (
    page = 1,
    limit = 10
): Promise<{ reviews: ReviewData[]; pagination: PaginationData }> => {
    const response = await api.get<
        ApiResponse<{ reviews: ReviewData[]; pagination: PaginationData }>
    >(`/reviews?page=${page}&limit=${limit}`);
    return response.data.data!;
};

export const deleteReview = async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
};



