"use client";

import { useRouter } from "next/navigation";
import { Review } from "@/types";
import { FileCode, ChevronRight, Clock } from "lucide-react";

interface RecentReviewsProps {
    reviews: (Partial<Review> & {
        _id?: string;
        fileName?: string;
        language?: string;
        createdAt?: string;
        overallScore?: number;
    })[];
    loading?: boolean;
}

export default function RecentReviews({
    reviews,
    loading = false,
}: RecentReviewsProps) {
    const router = useRouter();

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400";
        if (score >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    const getLanguageColor = (lang: string) => {
        const colors: Record<string, string> = {
            javascript: "bg-yellow-900/30 text-yellow-300",
            typescript: "bg-blue-900/30 text-blue-300",
            python: "bg-green-900/30 text-green-300",
            java: "bg-orange-900/30 text-orange-300",
            cpp: "bg-purple-900/30 text-purple-300",
            go: "bg-cyan-900/30 text-cyan-300",
            rust: "bg-red-900/30 text-red-300",
        };
        return colors[lang] || "bg-slate-900/30 text-slate-300";
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Reviews</h3>
            <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div
                key={i}
                className="h-16 bg-slate-700/30 rounded-lg animate-pulse"
                ></div>
            ))}
            </div>
        </div>
        );
    }

    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Recent Reviews</h3>
            <button
                onClick={() => router.push("/history")}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
            View All
            </button>
        </div>

        {reviews.length === 0 ? (
            <div className="text-center py-8">
            <FileCode className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No reviews yet</p>
            <button
                onClick={() => router.push("/review")}
                className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
                Create your first review →
            </button>
            </div>
      ) : (
            <div className="space-y-2">
            {reviews.map((review) => (
                <button
                key={review._id}
                onClick={() => router.push(`/review/${review._id}`)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors group"
                >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-slate-700 flex-shrink-0">
                    <FileCode className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                    <p className="text-white text-sm font-medium truncate">
                        {review.fileName || "Untitled"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <span
                        className={`text-xs px-2 py-0.5 rounded ${getLanguageColor(review.language || "")}`}
                        >
                        {review.language}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {review.createdAt && formatTimeAgo(review.createdAt)}
                        </span>
                    </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                    className={`text-lg font-bold ${getScoreColor(review.overallScore || 0)}`}
                    >
                    {review.overallScore}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
                </button>
            ))}
            </div>
        )}
        </div>
    );
}












