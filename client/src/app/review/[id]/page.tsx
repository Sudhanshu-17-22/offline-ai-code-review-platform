"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getReviewById } from "@/libraries/review";
import type { ReviewData } from "@/types";
import ReviewResult from "@/components/review/review.result";
import StaticIssueCard from "@/components/review/static.issue.card";
import CodeMetricsPanel from "@/components/review/code.metrics.panel";
import Loader from "@/components/ui/Loader";

export default function ReviewPage() {
    const params = useParams();
    const [review, setReview] = useState<ReviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReview = async () => {
            try {
                const data = await getReviewById(params.id as string);
                setReview(data);
            } catch {
                setError("Failed to load review");
            } finally {
                setLoading(false);
            }
        };

        loadReview();
    }, [params.id]);

    if (loading) return <Loader />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!review) {
        return <div className="text-red-500">Review not found</div>;
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Code Review</h1>
            <p className="text-slate-400">
               {review.language}
            </p>
            </div>

            {/* Overall Score */}
            <div className="bg-slate-700 rounded-lg p-6 mb-8 border border-slate-600">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-slate-300 text-lg mb-2">Overall Score</p>
                <p className="text-5xl font-bold text-green-400">
                    {review.aiAnalysis?.overallScore ?? 0}/100
                </p>
                </div>
                <div className="text-right">
                <p className="text-slate-300">AI Score: {review.aiAnalysis?.overallScore ?? 0} </p>
                <p className="text-slate-300">
                    Static Score: {review.staticAnalysis?.score ?? 0}
                </p>
                </div>
            </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-3 gap-6">
            {/* AI Findings */}
            <div className="col-span-2">
                <ReviewResult 
                    aiFindings={JSON.stringify(review.aiAnalysis?.issues ?? [])}
                    overallScore={review.aiAnalysis?.overallScore ?? 0}
                    correctedCode={review.aiAnalysis?.correctedCode ?? ""}
                />
            </div>

            {/* Code Metrics */}
            <div>
                <CodeMetricsPanel metrics={review.staticAnalysis?.metrics} />
            </div>
            </div>

            {/* Static Analysis Findings */}
            {review.staticAnalysis?.findings && (
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                    Static Analysis ({review.staticAnalysis.findings.length} issues)
                </h2>
                <div className="space-y-3">
                {review.staticAnalysis.findings.map((finding, idx) => (
                    <StaticIssueCard key={idx} finding={finding} />
                ))}
                </div>
            </div>
            )}
        </div>
        </div>
    );
}




