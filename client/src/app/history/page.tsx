"use client";

import Loader from "@/components/ui/Loader";
import { Review } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchReviewHistory, deleteReview } from "@/libraries/api";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    FileCode,
    Trash2,
    ArrowUpDown,
    ArrowLeft,
} from "lucide-react";

interface HistoryReview extends Omit<Review, "language"> {
    _id: string;
    fileName?: string;
    language: string;
    overallScore: number;
    createdAt: string;
    staticAnalysis?: {
        findings?: unknown[];
    };
}

const LANGUAGES = [
    "all",
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "go",
    "rust",
];

export default function HistoryPage() {
        const router = useRouter();

        const [reviews, setReviews] = useState<HistoryReview[]>([]);  const [language, setLanguage] = useState("all");
        const [loading, setLoading] = useState(true);
        const [search, setSearch] = useState("");
        const [sortBy, setSortBy] = useState("createdAt");
        const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
        const [minScore, setMinScore] = useState<number | undefined>();
        const [maxScore, setMaxScore] = useState<number | undefined>();
        const [page, setPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [total, setTotal] = useState(0);
        const [deleting, setDeleting] = useState<string | null>(null);

        const loadReviews = useCallback(async () => {
        try {
        const data = await fetchReviewHistory({
            page,
            limit: 10,
            language: language === "all" ? undefined : language,
            search: search || undefined,
            sortBy,
            sortOrder,
            minScore,
            maxScore,
        });

        setReviews(data.reviews);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
        } 
        catch (error) {
            console.error("Failed to load reviews:", error);
        } 
        finally {
            setLoading(false);
        }
        }, [page, language, search, sortBy, sortOrder, minScore, maxScore]);

        useEffect(() => {
            const timer = setTimeout(() => {
                void loadReviews();
        }, 0);
        return () => clearTimeout(timer);
        }, [loadReviews]);

        const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Delete this review? This action cannot be undone.")) {
            return;
        }
        setDeleting(id);
        try {
            await deleteReview(id);
            setReviews(reviews.filter((r) => r._id !== id));
            setTotal(total - 1);
        } 
        catch {
            alert("Failed to delete review");
        } 
        finally {
            setDeleting(null);
        }
    };
    const toggleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } 
        else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400 bg-green-900/20";
        if (score >= 60) return "text-yellow-400 bg-yellow-900/20";
        return "text-red-400 bg-red-900/20";
    };

    const getLanguageBadgeColor = (lang: string) => {
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

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
            <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <h1 className="text-4xl font-bold text-white mb-2">Review History</h1>
            <p className="text-slate-400">
                {total} review{total !== 1 ? "s" : ""} total
            </p>
            </div>

            {/* Filters Section */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-400" />
                Filters & Search
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search by filename..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                </div>

                {/* Language Filter */}
                <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors capitalize"
                >
                {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                    {lang === "all" ? "All Languages" : lang}
                    </option>
                ))}
                </select>

                {/* Min Score */}
                <div>
                <label className="block text-xs text-slate-400 mb-1">
                    Min Score
                </label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={minScore ?? ""}
                    onChange={(e) =>
                    setMinScore(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                </div>

                {/* Max Score */}
                <div>
                <label className="block text-xs text-slate-400 mb-1">
                    Max Score
                </label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="100"
                    value={maxScore ?? ""}
                    onChange={(e) =>
                    setMaxScore(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                </div>
            </div>

            {/* Clear Filters Button */}
            {(search || language !== "all" || minScore !== undefined || maxScore !== undefined) && (
                <button
                onClick={() => {
                    setSearch("");
                    setLanguage("all");
                    setMinScore(undefined);
                    setMaxScore(undefined);
                }}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                    Clear all filters
                </button>
            )}
            </div>

            {/* Loading State */}
            {loading && reviews.length === 0 ? (
            <div className="flex items-center justify-center py-12">
                <Loader message="Loading reviews..." />
            </div>
            ) : reviews.length === 0 ? (
            /* Empty State */
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-12 text-center">
                <FileCode className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">No reviews found</p>
                <p className="text-slate-500 text-sm mb-6">
                    Try adjusting your filters or create a new review
                </p>
                <button
                onClick={() => router.push("/review")}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                    Create Review
                </button>
            </div>
            ) : (
            <>
                {/* Reviews Table */}
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                    {/* Table Header */}
                    <thead className="bg-slate-900/50 border-b border-slate-700">
                        <tr>
                        <th className="px-6 py-4 text-left">
                            <button
                            onClick={() => toggleSort("fileName")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm uppercase tracking-wide"
                            >
                            File Name
                            {sortBy === "fileName" && (
                                <ArrowUpDown className="w-4 h-4" />
                            )}
                            </button>
                        </th>
                        <th className="px-6 py-4 text-left">
                            <button
                            onClick={() => toggleSort("language")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm uppercase tracking-wide"
                            >
                            Language
                            {sortBy === "language" && (
                                <ArrowUpDown className="w-4 h-4" />
                            )}
                            </button>
                        </th>
                        <th className="px-6 py-4 text-left">
                            <button
                            onClick={() => toggleSort("overallScore")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm uppercase tracking-wide"
                            >
                            Score
                            {sortBy === "overallScore" && (
                                <ArrowUpDown className="w-4 h-4" />
                            )}
                            </button>
                        </th>
                        <th className="px-6 py-4 text-left text-slate-400 font-medium text-sm uppercase tracking-wide">
                            Issues
                        </th>
                        <th className="px-6 py-4 text-left">
                            <button
                            onClick={() => toggleSort("createdAt")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm uppercase tracking-wide"
                            >
                            Date
                            {sortBy === "createdAt" && (
                                <ArrowUpDown className="w-4 h-4" />
                            )}
                            </button>
                        </th>
                        <th className="px-6 py-4 text-right text-slate-400 font-medium text-sm uppercase tracking-wide">
                            Actions
                        </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-slate-700">
                        {reviews.map((review) => (
                        <tr
                            key={review._id}
                            onClick={() => router.push(`/review/${review._id}`)}
                            className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                        >
                            {/* File Name */}
                            <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-700 flex-shrink-0">
                                <FileCode className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="text-white font-medium truncate">
                                {review.fileName || "Untitled"}
                                </span>
                            </div>
                            </td>

                            {/* Language */}
                            <td className="px-6 py-4">
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLanguageBadgeColor(review.language)}`}
                            >
                                {review.language}
                            </span>
                            </td>

                            {/* Score */}
                            <td className="px-6 py-4">
                            <div
                                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold ${getScoreColor(review.overallScore)}`}
                            >
                                {review.overallScore}
                            </div>
                            </td>

                            {/* Issues */}
                            <td className="px-6 py-4">
                            <span className="text-slate-400">
                                {review.staticAnalysis?.findings?.length || 0}
                            </span>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4 text-slate-400 text-sm">
                            {formatDate(review.createdAt)}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 text-right">
                            <button
                                onClick={(e) => handleDelete(review._id, e)}
                                disabled={deleting === review._id}
                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                title="Delete review"
                            >
                                {deleting === review._id ? (
                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                <Trash2 className="w-4 h-4" />
                                )}
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                    <div className="text-slate-400 text-sm">
                    Showing{" "}
                    <span className="font-medium text-white">
                        {(page - 1) * 10 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-white">
                        {Math.min(page * 10, total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-white">{total}</span>
                    </div>

                    <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                            <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                page === p
                                ? "bg-blue-600 text-white"
                                : "border border-slate-600 text-slate-400 hover:text-white hover:border-slate-500"
                            }`}
                            >
                            {p}
                            </button>
                        )
                        )}
                    </div>

                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    </div>
                </div>
                )}
            </>
            )}
        </div>
        </div>
    );
}






