import { StaticFinding } from "@/types";
import {
    AlertCircle,
    AlertTriangle,
    Info,
} from "lucide-react";

interface StaticIssueCardProps {
    finding: StaticFinding;
}

export default function StaticIssueCard({
  finding,
}: StaticIssueCardProps) {
    const Icon =
        finding.severity === "error"
        ? AlertCircle
        : finding.severity === "warning"
        ? AlertTriangle
        : Info;

    const color =
        finding.severity === "error"
        ? "text-red-400"
        : finding.severity === "warning"
        ? "text-yellow-400"
        : "text-blue-400";

    return (
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
        <div className="flex items-start gap-3">
            <Icon
            className={`w-5 h-5 mt-0.5 ${color}`}
            />

            <div className="flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-white font-semibold">
                {finding.rule}
                </h3>

                <span
                className={`text-xs font-medium uppercase ${color}`}
                >
                {finding.severity}
                </span>
            </div>

            <p className="text-slate-300 text-sm mb-2">
                {finding.message}
            </p>

            <p className="text-slate-500 text-xs">
                Line {finding.line}, Column {finding.column}
            </p>

            {finding.fix && (
                <div className="mt-3 p-3 rounded-lg bg-slate-800 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">
                    Suggested fix
                </p>

                <code className="text-xs text-slate-300 break-all">
                    {finding.fix.text}
                </code>
                </div>
            )}
            </div>
        </div>
        </div>
    );
}




