import React from "react";
import { render, screen } from "@testing-library/react";
import StatsCard from "../stats.card";
import { Zap } from "lucide-react";

describe("StatsCard Component", () => {
    it("should render title and value", () => {
        render(<StatsCard title="Total Reviews" value={12} icon={Zap} />);

        expect(screen.getByText("Total Reviews")).toBeInTheDocument();
        expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("should render with suffix", () => {
        render(
        <StatsCard
            title="Average Score"
            value={85}
            icon={Zap}
            suffix="/100"
        />
        );
        expect(screen.getByText("/100")).toBeInTheDocument();
    });

    it("should render trend indicator when positive", () => {
        render(
        <StatsCard
            title="Score"
            value={85}
            icon={Zap}
            trend={12}
        />
        );

        expect(screen.getByText("12%")).toBeInTheDocument();
    });
    it("should render trend indicator when negative", () => {
        render(
        <StatsCard
            title="Score"
            value={85}
            icon={Zap}
            trend={-5}
        />
        );

        expect(screen.getByText("5%")).toBeInTheDocument();
    });
    it("should apply custom icon color", () => {
        const { container } = render(
        <StatsCard
            title="Test"
            value={10}
            icon={Zap}
            iconColor="text-red-400"
        />
        );

        const iconWrapper = container.querySelector(".text-red-400");
        expect(iconWrapper).toBeInTheDocument();
    });
});



