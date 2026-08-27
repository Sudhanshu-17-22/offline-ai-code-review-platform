import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "@/app/dashboard/page";
import * as api from "@/libraries/api";
import { useRouter } from "next/navigation";

jest.mock("@/libraries/api");
jest.mock("next/navigation");

const mockStats = {
    totalReviews: 12,
    averageScore: 76,
    totalIssuesFound: 34,
    averageComplexity: 5.2,
    reviewsThisWeek: 4,
    scoreImprovement: 8,
};
const mockTrend = [
    { date: "2024-01-10", score: 70, count: 1 },
    { date: "2024-01-12", score: 78, count: 2 },
];
const mockLanguages = [
    { language: "javascript", count: 8, averageScore: 75 },
    { language: "typescript", count: 4, averageScore: 80 },
];
const mockIssues = [
    { rule: "no-unused-vars", count: 8 },
    { rule: "prefer-const", count: 5 },
];
const mockReviews = {
    reviews: [
        {
            _id: "1",
            fileName: "test.js",
            language: "javascript",
            overallScore: 85,
            createdAt: new Date().toISOString(),
        },
    ],
    pagination: { total: 1, page: 1, limit: 5, totalPages: 1 },
};

describe("Dashboard Page", () => {
    const mockRouter = {
        push: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (api.fetchDashboardStats as jest.Mock).mockResolvedValue(mockStats);
        (api.fetchScoreTrend as jest.Mock).mockResolvedValue(mockTrend);
        (api.fetchLanguageBreakdown as jest.Mock).mockResolvedValue(
        mockLanguages
        );
        (api.fetchTopIssues as jest.Mock).mockResolvedValue(mockIssues);
        (api.fetchReviewHistory as jest.Mock).mockResolvedValue(mockReviews);
    });

    it("should render dashboard with all sections", async () => {
        render(<DashboardPage />);

        await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });

        expect(screen.getByText("Total Reviews")).toBeInTheDocument();
        expect(screen.getByText("Average Score")).toBeInTheDocument();
        expect(screen.getByText("Issues Found")).toBeInTheDocument();
    });
    it("should display stats cards with correct values", async () => {
        render(<DashboardPage />);

        await waitFor(() => {
        expect(screen.getByText("12")).toBeInTheDocument();
        expect(screen.getByText("76")).toBeInTheDocument();
        });
    });
    it("should display charts", async () => {
        render(<DashboardPage />);

        await waitFor(() => {
        expect(
            screen.getByText("Score Trend (Last 30 Days)")
        ).toBeInTheDocument();
        expect(screen.getByText("Language Distribution")).toBeInTheDocument();
        });
    });
    it("should display recent reviews", async () => {
        render(<DashboardPage />);

        await waitFor(() => {
        expect(screen.getByText("test.js")).toBeInTheDocument();
        });
    });
    it("should navigate to review page on New Review click", async () => {
        const user = userEvent.setup();

        render(<DashboardPage />);

        await waitFor(() => {
        expect(screen.getByText("New Review")).toBeInTheDocument();
        });

        const newReviewButton = screen.getByText("New Review");

        await user.click(newReviewButton);

        expect(mockRouter.push).toHaveBeenCalledWith("/review");
    });
    it("should call all API endpoints on mount", async () => {
        render(<DashboardPage />);

        await waitFor(() => {
        expect(api.fetchDashboardStats).toHaveBeenCalledTimes(1);
        expect(api.fetchScoreTrend).toHaveBeenCalledWith(30);
        expect(api.fetchLanguageBreakdown).toHaveBeenCalledTimes(1);
        expect(api.fetchTopIssues).toHaveBeenCalledWith(5);
        });
    });
    it("should handle API errors gracefully", async () => {
        (api.fetchDashboardStats as jest.Mock).mockRejectedValue(
        new Error("API Error")
        );

        render(<DashboardPage />);

        await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });
    });
});





