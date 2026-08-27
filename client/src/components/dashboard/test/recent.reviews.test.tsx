import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecentReviews from "../recent.reviews";
import { useRouter } from "next/navigation";
import { SupportedLanguage } from "@/types";

jest.mock("next/navigation");

const mockReviews = [
    {
        _id: "1",
        fileName: "fibonacci.js",
        language: "javascript" as SupportedLanguage,
        overallScore: 85,
        createdAt: new Date().toISOString(),
    },
    {
        _id: "2",
        fileName: "quicksort.js",
        language: "javascript" as SupportedLanguage,
        overallScore: 72,
        createdAt: new Date().toISOString(),
    },
];
describe("RecentReviews Component", () => {
    const mockRouter = {
        push: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it("should render recent reviews list", () => {
        render(<RecentReviews reviews={mockReviews} />);

        expect(screen.getByText("fibonacci.js")).toBeInTheDocument();
        expect(screen.getByText("quicksort.js")).toBeInTheDocument();
    });
    it("should display review score", () => {
        render(<RecentReviews reviews={mockReviews} />);

        expect(screen.getByText("85")).toBeInTheDocument();
        expect(screen.getByText("72")).toBeInTheDocument();
    });
    it("should display language badges", () => {
        render(<RecentReviews reviews={mockReviews} />);

        const languageBadges = screen.getAllByText("javascript");
        expect(languageBadges).toHaveLength(2);
    });
    it("should show empty state when no reviews", () => {
        render(<RecentReviews reviews={[]} />);

        expect(screen.getByText("No reviews yet")).toBeInTheDocument();
    });
    it("should navigate to review details on click", async () => {
        const user = userEvent.setup();

        render(<RecentReviews reviews={mockReviews} />);

        const reviewButton = screen.getByText("fibonacci.js").closest("button");

        await user.click(reviewButton!);

        expect(mockRouter.push).toHaveBeenCalledWith("/review/1");
    });

    it("should show loading skeleton", () => {
        const { container } = render(
        <RecentReviews reviews={[]} loading={true} />
        );

        const skeletons = container.querySelectorAll(".animate-pulse");

        expect(skeletons.length).toBeGreaterThan(0);
    });
});




