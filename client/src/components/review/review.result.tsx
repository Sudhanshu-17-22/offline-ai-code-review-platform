"use client";

import { memo } from "react";
import { TrendingUp, CheckCircle, AlertCircle, Code2 } from "lucide-react";

interface ReviewResultProps {
    aiFindings: string;
    overallScore: number;
    correctedCode: string;
}

const ReviewResult = memo(function ReviewResult({
    aiFindings,
    overallScore,
    correctedCode,
}: ReviewResultProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400";
        if (score >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return "bg-green-900/20 border-green-700/30";
        if (score >= 60) return "bg-yellow-900/20 border-yellow-700/30";
        return "bg-red-900/20 border-red-700/30";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        return "Needs Improvement";
    };

    return (
        <div className="space-y-6">
            <div
                className={`rounded-lg border p-6 flex items-center justify-between ${getScoreBgColor(overallScore)}`}
            >
                <div className="flex items-center gap-4">
                    {overallScore >= 80 ? (
                        <CheckCircle className="w-10 h-10 text-green-400 flex-shrink-0" />
                    ) : (
                        <AlertCircle
                            className={`w-10 h-10 flex-shrink-0 ${
                                overallScore >= 60
                                    ? "text-yellow-400"
                                    : "text-red-400"
                            }`}
                        />
                    )}
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Overall Score</p>
                        <p className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                            {overallScore}
                            <span className="text-lg">/100</span>
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-slate-400 text-sm">Assessment</p>
                    <p className="text-2xl font-bold text-slate-200">
                        {getScoreLabel(overallScore)}
                    </p>
                </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    AI Code Review Analysis
                </h3>

                {aiFindings ? (
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/30 p-4 rounded-lg border border-slate-700">
                        {aiFindings}
                    </div>
                ) : (
                    <div className="text-slate-400 italic p-4 text-center">
                        No findings available
                    </div>
                )}
            </div>

            {correctedCode && (
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-700">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-green-400" />
                            Corrected Code
                        </h3>
                    </div>

                    <div className="overflow-x-auto bg-slate-950">
                        <pre className="p-6 text-sm leading-6 text-slate-200 font-mono">
                            {correctedCode
                                .replace(/\\n/g, "\n")
                                .replace(/\\"/g, '"')
                                .split("\n")
                                .map((line, index) => (
                                <div key={index} className="flex">
                                    <span className="select-none w-12 pr-4 text-right text-slate-600">
                                        {index + 1}
                                    </span>
                                    <code className="whitespace-pre">
                                        {line || " "}
                                    </code>
                                </div>
                            ))}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
});
export default ReviewResult;
