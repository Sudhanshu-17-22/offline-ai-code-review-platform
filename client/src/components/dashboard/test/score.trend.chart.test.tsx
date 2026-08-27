import React from "react";
import { render, screen } from "@testing-library/react";
import ScoreTrendChart from "../score.trend.chart";

jest.mock("recharts", () => ({
    LineChart: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="line-chart">{children}</div>
    ),
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="responsive-container">{children}</div>
    ),
}));

const mockData = [
    { date: "2024-01-10", score: 70, count: 1 },
    { date: "2024-01-12", score: 78, count: 2 },
    { date: "2024-01-15", score: 85, count: 1 },
];

describe("ScoreTrendChart Component", () => {
    it("should render chart title", () => {
        render(<ScoreTrendChart data={mockData} />);

        expect(
        screen.getByText("Score Trend (Last 30 Days)")
        ).toBeInTheDocument();
    });
    it("should render chart with data", () => {
        render(<ScoreTrendChart data={mockData} />);

        expect(screen.getByTestId("line-chart")).toBeInTheDocument();
        expect(screen.getByTestId("line")).toBeInTheDocument();
    });
    it("should show empty state when no data", () => {
        render(<ScoreTrendChart data={[]} />);

        expect(screen.getByText(/Not enough data yet/i)).toBeInTheDocument();
    });
    it("should show loading state", () => {
        const { container } = render(
        <ScoreTrendChart data={[]} loading={true} />
        );

        const skeleton = container.querySelector(".animate-pulse");

        expect(skeleton).toBeInTheDocument();
    });
});





