'use client';

import { useState } from 'react';
import { CodeIssue } from '@/types';
import SeverityBadge from '@/components/review/severity.badge';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
} from 'lucide-react';

interface IssueCardProps {
  issue: CodeIssue;
  index: number;
}

const severityIcons = {
  critical: <AlertCircle className="text-red-600" size={20} />,
  high: <AlertTriangle className="text-orange-600" size={20} />,
  medium: <AlertTriangle className="text-yellow-600" size={20} />,
  low: <Info className="text-blue-600" size={20} />,
  warning: <AlertTriangle className="text-amber-600" size={20} />,
  info: <CheckCircle className="text-gray-600" size={20} />,
};

export default function IssueCard({ issue, index }: IssueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        aria-expanded={isExpanded}
        aria-controls={`issue-details-${index}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {severityIcons[issue.severity]}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {issue.title}
            </h4>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <SeverityBadge severity={issue.severity} />

              {issue.line && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Line {issue.line}
                </span>
              )}

              <span className="text-xs text-gray-500 dark:text-gray-400">
                #{index + 1}
              </span>
            </div>
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp
            size={20}
            className="text-gray-400 flex-shrink-0 ml-3"
          />
        ) : (
          <ChevronDown
            size={20}
            className="text-gray-400 flex-shrink-0 ml-3"
          />
        )}
      </button>

      {isExpanded && (
        <div
          id={`issue-details-${index}`}
          className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
        >
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {issue.description}
          </p>

          {issue.suggestion && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                💡 Suggestion:
              </p>

              <p className="text-sm text-green-700 dark:text-green-400">
                {issue.suggestion}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


