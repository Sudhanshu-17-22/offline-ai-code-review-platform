"use client";

import { useEffect } from "react";
import { ReviewStreamingState } from "@/hooks/use.review.socket";
import {
    Loader,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Zap,
} from "lucide-react";

interface StreamingReviewPanelProps {
    state: ReviewStreamingState;
    onComplete: (reviewId: string) => void;
}

export default function StreamingReviewPanel({
    state,
    onComplete,
}: StreamingReviewPanelProps) {
    const fullAiResponse = state.aiChunks.join("");

    useEffect(() => {
        if (state.status !== "complete" || !state.reviewId) {
            return;
        }

        const timer = setTimeout(() => {
            onComplete(state.reviewId!);
        }, 1500);

        return () => clearTimeout(timer);
    }, [state.status, state.reviewId, onComplete]);

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {state.status === "complete" ? (
                            <>
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                Review Complete
                            </>
                        ) : state.status === "error" ? (
                            <>
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                Error
                            </>
                        ) : (
                            <>
                                <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                                {state.message}
                            </>
                        )}
                    </h3>

                    <span className="text-sm font-mono text-slate-400">
                        {state.progress}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                    <div
                        className={`h-full rounded-full transition-all duration-300 ${
                            state.status === "complete"
                                ? "bg-green-500"
                                : state.status === "error"
                                ? "bg-red-500"
                                : "bg-blue-500"
                        }`}
                        style={{ width: `${state.progress}%` }}
                    />
                </div>

                {/* Status Text */}
                <p className="text-slate-400 text-sm">
                    {state.message}
                </p>

                {/* Error Message */}
                {state.status === "error" && state.error && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-700/30 rounded text-red-300 text-sm">
                        {state.error}
                    </div>
                )}
            </div>

            {/* Static Analysis Results (when ready) */}
            {state.staticAnalysis && (
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Static Analysis
                    </h4>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 text-center">
                            <p className="text-red-400 text-2xl font-bold">
                                {state.staticAnalysis.findings.length}
                            </p>
                            <p className="text-red-300 text-xs uppercase mt-1">
                                Issues
                            </p>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 text-center">
                            <p className="text-blue-400 text-2xl font-bold">
                                {state.staticAnalysis.metrics.cyclomaticComplexity}
                            </p>
                            <p className="text-blue-300 text-xs uppercase mt-1">
                                Complexity
                            </p>
                        </div>

                        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 text-center">
                            <p className="text-green-400 text-2xl font-bold">
                                {state.staticAnalysis.score}
                            </p>
                            <p className="text-green-300 text-xs uppercase mt-1">
                                Score
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Response Streaming */}
            {state.status !== "idle" && (
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        AI Analysis
                    </h4>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 min-h-64 max-h-96 overflow-y-auto">
                        {fullAiResponse ? (
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                                {fullAiResponse}

                                {state.status === "streaming" && (
                                    <span className="animate-pulse">▊</span>
                                )}
                            </p>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-slate-500">
                                {state.status === "analyzing"
                                    ? "Analyzing code..."
                                    : "Waiting for response..."}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Complete Message */}
            {state.status === "complete" && (
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />

                    <p className="text-green-300 font-medium text-lg mb-2">
                        ✓ Review Complete!
                    </p>

                    <p className="text-green-200/70">
                        Score:{" "}
                        <span className="font-bold">
                            {state.overallScore}/100
                        </span>
                    </p>

                    <p className="text-green-200/50 text-sm mt-2">
                        Redirecting to review page...
                    </p>
                </div>
            )}
        </div>
    );
}











