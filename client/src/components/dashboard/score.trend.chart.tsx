"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface ScoreTrendPoint {
    date: string;
    score: number;
    count: number;
}

interface ScoreTrendChartProps {
    data: ScoreTrendPoint[];
    loading?: boolean;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value?: number;
        payload?: ScoreTrendPoint;
    }>;
    label?: string;
}

const CustomTooltip = ({
    active,
    payload,
    label,
}: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-lg">
            <p className="text-slate-400 text-xs mb-1">
            {label ? formatDate(label) : ""}
            </p>
            <p className="text-white font-bold text-lg">
                Score: {payload[0].value}
            </p>
            <p className="text-slate-400 text-xs">
            {payload[0].payload?.count ?? 0} review(s)
            </p>
        </div>
        );
    }

    return null;
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export default function ScoreTrendChart({
    data,
    loading = false,
}: ScoreTrendChartProps) {
    if (loading) {
        return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Score Trend</h3>
            <div className="h-64 bg-slate-700/30 rounded-lg animate-pulse"></div>
        </div>
        );
    }

    if (data.length === 0) {
        return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
                Score Trend
            </h3>
            <div className="h-64 flex items-center justify-center text-slate-500">
                Not enough data yet. Complete more reviews to see trends.
            </div>
        </div>
        );
    }

    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
                Score Trend (Last 30 Days)
        </h3>

        <ResponsiveContainer width="100%" height={280}>
            <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: "#94a3b8" }}
            />

            <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: "#94a3b8" }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
            />
            </LineChart>
        </ResponsiveContainer>
        </div>
    );
}








