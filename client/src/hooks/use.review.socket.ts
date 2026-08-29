"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { StaticAnalysisResult } from "@/types";

export interface ReviewStreamingState {
  status:
    | "idle"
    | "connecting"
    | "analyzing"
    | "streaming"
    | "saving"
    | "complete"
    | "error";
  message: string;
  progress: number;
  aiChunks: string[];
  staticAnalysis?: StaticAnalysisResult;
  reviewId?: string;
  overallScore?: number;
  staticScore?: number;
  aiScore?: number;
  error?: string;
}

interface ReviewStatusData {
  status: ReviewStreamingState["status"];
  message: string;
  progress: number;
}

interface ReviewChunkData {
  chunk: string;
  progress: number;
}

interface ReviewStaticCompleteData {
  staticAnalysis: StaticAnalysisResult;
}

interface ReviewCompleteData {
  message: string;
  reviewId: string;
  overallScore: number;
  staticScore?: number;
  aiScore?: number;
}

interface ReviewErrorData {
  message: string;
}

interface UseReviewSocketReturn {
  state: ReviewStreamingState;
  submitReview: (
    code: string,
    language: string,
    fileName?: string
  ) => void;
  reset: () => void;
  isConnected: boolean;
}

export const useReviewSocket = (): UseReviewSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [state, setState] = useState<ReviewStreamingState>({
    status: "idle",
    message: "Ready to submit code",
    progress: 0,
    aiChunks: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
        queueMicrotask(() => {
            setState((prev) => ({
                ...prev,
                status: "error",
                error: "Authentication required",
            }));
        });

        return;
    }

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        auth: { token },
        transports: ["polling", "websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✓ Socket connected");

      setIsConnected(true);

      setState((prev) => ({
        ...prev,
        status: "idle",
        message: "Ready to submit code",
        error: undefined,
      }));
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);

      setIsConnected(false);

      setState((prev) => ({
        ...prev,
        status: "error",
        error: "Connection failed. Please check your internet.",
      }));
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("review:status", (data: ReviewStatusData) => {
      setState((prev) => ({
        ...prev,
        status: data.status,
        message: data.message,
        progress: data.progress,
      }));
    });

    socket.on("review:chunk", (data: ReviewChunkData) => {
      setState((prev) => ({
        ...prev,
        aiChunks: [...prev.aiChunks, data.chunk],
        progress: data.progress,
      }));
    });

    socket.on(
      "review:static-complete",
      (data: ReviewStaticCompleteData) => {
        setState((prev) => ({
          ...prev,
          staticAnalysis: data.staticAnalysis,
        }));
      }
    );

    socket.on("review:complete", (data: ReviewCompleteData) => {
      setState((prev) => ({
        ...prev,
        status: "complete",
        message: data.message,
        progress: 100,
        reviewId: data.reviewId,
        overallScore: data.overallScore,
        staticScore: data.staticScore,
        aiScore: data.aiScore,
      }));
    });

    socket.on("review:error", (data: ReviewErrorData) => {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: data.message,
        progress: 0,
      }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const submitReview = useCallback(
    (code: string, language: string, fileName?: string) => {
      if (!socketRef.current?.connected) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: "Socket not connected",
        }));
        return;
      }

      setState({
        status: "connecting",
        message: "Connecting to server...",
        progress: 10,
        aiChunks: [],
      });

      socketRef.current.emit("review:start", {
        code,
        language,
        fileName,
      });
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      status: "idle",
      message: "Ready to submit code",
      progress: 0,
      aiChunks: [],
    });
  }, []);

  return {
    state,
    submitReview,
    reset,
    isConnected,
  };
};

