"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    trend?: number; // percentage change
    suffix?: string;
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    iconColor = "text-blue-400",
    trend,
    suffix = "",
}: StatsCardProps) {
    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg bg-slate-700/50 ${iconColor}`}>
            <Icon className="w-6 h-6" />
            </div>

            {trend !== undefined && trend !== 0 && (
            <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                trend > 0
                    ? "bg-green-900/30 text-green-400"
                    : "bg-red-900/30 text-red-400"
                }`}
            >
                {trend > 0 ? (
                <TrendingUp className="w-3 h-3" />
                ) : (
                <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(trend)}%
            </div>
            )}
        </div>

        <p className="text-slate-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">
            {value}
            {suffix && <span className="text-lg text-slate-400 ml-1">{suffix}</span>}
        </p>
        </div>
    );
}









