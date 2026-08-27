import { renderHook, act } from "@testing-library/react";
import { useReviewSocket } from "../use.review.socket";
import io from "socket.io-client";

jest.mock("socket.io-client");

const mockSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    connected: true,
};

describe("useReviewSocket Hook", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem("token", "test-token");
        (io as jest.Mock).mockReturnValue(mockSocket);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it("should initialize with idle state", () => {
        const { result } = renderHook(() => useReviewSocket());

        expect(result.current.state.status).toBe("idle");
        expect(result.current.state.aiChunks).toEqual([]);
    });
    it("should establish socket connection with auth token", () => {
        renderHook(() => useReviewSocket());

        expect(io).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
            auth: {
            token: "test-token",
            },
        })
        );
    });
    it("should emit review:start when submitReview is called", () => {
        const { result } = renderHook(() => useReviewSocket());

        act(() => {
        result.current.submitReview(
            "function test() {}",
            "javascript",
            "test.js"
        );
        });

        expect(mockSocket.emit).toHaveBeenCalledWith(
        "review:start",
        expect.objectContaining({
            code: "function test() {}",
            language: "javascript",
            fileName: "test.js",
        })
        );
    });
    it("should register all necessary socket event listeners", () => {
        renderHook(() => useReviewSocket());

        const registeredEvents = mockSocket.on.mock.calls.map(
        (call) => call[0]
        );

        expect(registeredEvents).toContain("connect");
        expect(registeredEvents).toContain("disconnect");
        expect(registeredEvents).toContain("review:status");
        expect(registeredEvents).toContain("review:chunk");
        expect(registeredEvents).toContain("review:complete");
        expect(registeredEvents).toContain("review:error");
    });
    it("should reset state when reset is called", () => {
        const { result } = renderHook(() => useReviewSocket());

        act(() => {
        result.current.reset();
        });

        expect(result.current.state.status).toBe("idle");
        expect(result.current.state.aiChunks).toEqual([]);
    });

    it("should disconnect socket on unmount", () => {
        const { unmount } = renderHook(() => useReviewSocket());

        unmount();

        expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
    });
});







