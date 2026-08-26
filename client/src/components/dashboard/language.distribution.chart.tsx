"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { Code2 } from "lucide-react";

interface LanguageData {
    language: string;
    count: number;
    averageScore: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: readonly {
        payload?: LanguageData;
    }[];
}

interface LanguageDistributionChartProps {
    data: LanguageData[];
    loading?: boolean;
}

const COLORS: Record<string, string> = {
    javascript: "#eab308",
    typescript: "#3b82f6",
    python: "#22c55e",
    java: "#f97316",
    cpp: "#a855f7",
    go: "#06b6d4",
    rust: "#ef4444",
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    const item = payload?.[0]?.payload;

    if (!active || !item) {
        return null;
    }

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-lg">
        <p className="text-white font-bold capitalize">{item.language}</p>
        <p className="text-slate-400 text-xs">
            {item.count} review(s) • Avg: {item.averageScore}
        </p>
        </div>
    );
};

export default function LanguageDistributionChart({
    data,
    loading = false,
}: LanguageDistributionChartProps) {
    if (loading) {
        return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">
                Language Distribution
            </h3>
            <div className="h-64 bg-slate-700/30 rounded-lg animate-pulse"></div>
        </div>
        );
    }

    if (data.length === 0) {
        return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-purple-400" />
                Language Distribution
            </h3>
            <div className="h-64 flex items-center justify-center text-slate-500">
                No data yet. Submit code to see distribution.
            </div>
        </div>
        );
    }

    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-purple-400" />
                Language Distribution
        </h3>

        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
            <Pie
                data={data}
                dataKey="count"
                nameKey="language"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
            >
                {data.map((entry, index) => (
                <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.language] || "#64748b"}
                />
                ))}
            </Pie>

            <Tooltip content={CustomTooltip} />

            <Legend
                formatter={(value) => (
                <span className="text-slate-300 text-sm capitalize">
                    {value}
                </span>
                )}
            />
            </PieChart>
        </ResponsiveContainer>
        </div>
    );
}


