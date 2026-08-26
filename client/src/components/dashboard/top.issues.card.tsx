"use client";

import { AlertTriangle } from "lucide-react";

interface TopIssue {
    rule: string;
    count: number;
}

interface TopIssuesCardProps {
    issues: TopIssue[];
    loading?: boolean;
}

export default function TopIssuesCard({
    issues,
    loading = false,
}: TopIssuesCardProps) {
    const maxCount = Math.max(...issues.map((i) => i.count), 1);

    if (loading) {
        return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Top Issues</h3>
            <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div
                key={i}
                className="h-10 bg-slate-700/30 rounded animate-pulse"
                ></div>
            ))}
            </div>
        </div>
        );
    }

    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Most Common Issues
        </h3>

        {issues.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">
                No issues found yet
            </p>
        ) : (
            <div className="space-y-3">
            {issues.map((issue, idx) => (
                <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300 text-sm font-mono truncate">
                    {issue.rule}
                    </span>
                    <span className="text-slate-400 text-xs">{issue.count}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    style={{
                        width: `${(issue.count / maxCount) * 100}%`,
                    }}
                    ></div>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}




