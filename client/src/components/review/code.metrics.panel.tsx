"use client";

import { CodeMetrics } from "@/types";
import {
    Activity,
    TrendingUp,
    Code,
    AlertCircle,
    Zap,
    Layers,
} from "lucide-react";

interface CodeMetricsPanelProps {
    metrics?: CodeMetrics;
}

export default function CodeMetricsPanel({
    metrics,
}: CodeMetricsPanelProps) {
    if (!metrics) {
        return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 text-center">
            <p className="text-slate-400 text-sm">
                No metrics available
            </p>
        </div>
        );
    }

    const getComplexityColor = (complexity: number) => {
        if (complexity <= 5) return "text-green-400";
        if (complexity <= 10) return "text-yellow-400";
        if (complexity <= 15) return "text-orange-400";
        return "text-red-400";
    };

    const getComplexityBg = (complexity: number) => {
        if (complexity <= 5) {
            return "bg-green-900/20 border-green-700/30";
        }

        if (complexity <= 10) {
            return "bg-yellow-900/20 border-yellow-700/30";
        }

        if (complexity <= 15) {
            return "bg-orange-900/20 border-orange-700/30";
        }

        return "bg-red-900/20 border-red-700/30";
    };

    const getComplexityLabel = (complexity: number) => {
        if (complexity <= 5) return "✓ Low";
        if (complexity <= 10) return "⚠ Moderate";
        if (complexity <= 15) return "⚠ High";
        return "✗ Very High";
    };

    const getDepthLabel = (depth: number) => {
        if (depth <= 3) return "✓ Good";
        if (depth <= 5) return "⚠ Fair";
        return "✗ Refactor";
    };

    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 sticky top-6">
        {/* Header */}
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
                Code Metrics
        </h3>

        {/* Metrics */}
        <div className="space-y-4 mb-8">
            {/* Cyclomatic Complexity */}
            <div
            className={`rounded-lg p-4 border transition-colors ${getComplexityBg(
                metrics.cyclomaticComplexity
            )}`}
            >
            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">
                    Cyclomatic Complexity
                </p>

                <Zap className="w-4 h-4 text-slate-400" />
            </div>

            <p
                className={`text-3xl font-bold ${getComplexityColor(
                    metrics.cyclomaticComplexity
                )}`}
            >
                {metrics.cyclomaticComplexity}
            </p>

            <p className="text-slate-400 text-xs mt-2">
                {getComplexityLabel(
                    metrics.cyclomaticComplexity
                )}

                {metrics.cyclomaticComplexity > 10 &&
                    " — Consider refactoring"}
            </p>
            </div>

            {/* Lines of Code */}
            <div className="rounded-lg p-4 border bg-blue-900/20 border-blue-700/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">
                    Lines of Code
                </p>

                <Code className="w-4 h-4 text-slate-400" />
            </div>

            <p className="text-3xl font-bold text-blue-400">
                {metrics.linesOfCode}
            </p>

            <p className="text-slate-400 text-xs mt-2">
                {metrics.linesOfCode <= 50 && "✓ Compact"}

                {metrics.linesOfCode > 50 &&
                metrics.linesOfCode <= 200 &&
                "◐ Medium"}

                {metrics.linesOfCode > 200 &&
                "⚠ Consider splitting"}
            </p>
            </div>

            {/* Nesting Depth */}
            <div
            className={`rounded-lg p-4 border transition-colors ${getComplexityBg(
                metrics.nestingDepth
            )}`}
            >
            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">
                    Max Nesting Depth
                </p>

                <Layers className="w-4 h-4 text-slate-400" />
            </div>

            <p
                className={`text-3xl font-bold ${getComplexityColor(
                    metrics.nestingDepth
                )}`}
            >
                {metrics.nestingDepth}
            </p>

            <p className="text-slate-400 text-xs mt-2">
                {getDepthLabel(metrics.nestingDepth)}
            </p>
            </div>
        </div>

        {/* Functions */}
        {metrics.functions.length > 0 && (
            <div className="pt-6 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                    Functions ({metrics.functions.length})
            </h4>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {metrics.functions.map((fn, idx) => (
                <div
                    key={idx}
                    className="bg-slate-700/50 rounded-lg p-3 text-sm hover:bg-slate-700 transition-colors border border-slate-600/50"
                >
                    <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-slate-300 font-mono font-semibold truncate">
                        {fn.name}()
                    </span>

                    <span
                        className={`text-xs font-bold flex-shrink-0 ${getComplexityColor(
                        fn.complexity
                        )}`}
                    >
                        CC: {fn.complexity}
                    </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{fn.lines}L</span>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        {/* Duplicate Patterns */}
        {metrics.duplicatePatterns.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                    Duplicate Code
            </h4>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3">
                <p className="text-yellow-300 text-xs font-medium mb-2">
                {metrics.duplicatePatterns.length} pattern(s) found
                </p>

                <p className="text-yellow-200/70 text-xs">
                    Apply DRY (Do Not Repeat Yourself) principle to
                    reduce duplication.
                </p>
            </div>
            </div>
        )}

        {/* Empty State */}
        {metrics.functions.length === 0 &&
            metrics.duplicatePatterns.length === 0 && (
            <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                <p className="text-slate-400 text-sm">
                    No additional details
                </p>
            </div>
            )}
        </div>
    );
}





