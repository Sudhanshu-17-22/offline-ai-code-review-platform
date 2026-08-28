"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    iconColor?: string;
    trend?: number | {
    value: number;
    isPositive: boolean;
};
    suffix?: string;
    color?: "blue" | "green" | "red" | "yellow";
}

const colorClasses = {
blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
};

export default function StatsCard({
    title,
    value,
    icon,
    iconColor = "text-blue-400",
    trend,
    suffix = "",
    color = "blue",
}: StatsCardProps) {
    const trendValue = typeof trend === "number" ? trend : trend?.value;
    const isPositive = typeof trend === "number" ? trend > 0 : trend?.isPositive;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition hover:shadow-md">
        <div className="flex items-start justify-between mb-2 sm:mb-4">
            <div
            className={`p-2 sm:p-3 rounded-lg ${
                typeof icon === "object" && icon !== null
                ? colorClasses[color]
                : `bg-slate-700/50 ${iconColor}`
            }`}
            >
            {icon}
            </div>

        {trendValue !== undefined && trendValue !== 0 && (
        <div
            className={`flex items-center gap-1 text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
            isPositive
                ? "bg-green-900/30 text-green-400"
                : "bg-red-900/30 text-red-400"
            }`}
        >
            {isPositive ? (
            <TrendingUp className="w-3 h-3" />
            ) : (
            <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trendValue)}%
        </div>
        )}
        </div>

        <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
        </h3>

        <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {value}
            {suffix && (
            <span className="text-lg text-gray-400 dark:text-slate-400 ml-1">
                {suffix}
            </span>
            )}
        </p>
        </div>
    );
}






