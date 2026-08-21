import { CodeIssue } from "@/types";
import SeverityBadge from "@/components/review/severity.badge";
import { Hash, Lightbulb } from "lucide-react";

interface IssueCardProps {
    issue: CodeIssue;
    index: number;
}

export default function IssueCard({ issue, index }: IssueCardProps) {
  return (
    <div className="p-5 rounded-xl bg-background-card border border-border hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-mono">#{index + 1}</span>
          <h3 className="font-semibold text-white">{issue.title}</h3>
        </div>
        <SeverityBadge severity={issue.severity} />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
        <Hash className="w-3 h-3" />
        Line {issue.line}
      </div>

      <p className="text-sm text-gray-300 leading-relaxed mb-3">
        {issue.description}
      </p>

      {issue.suggestion && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            <span className="text-primary font-medium">Suggestion: </span>
            {issue.suggestion}
          </p>
        </div>
      )}
    </div>
  );
}


