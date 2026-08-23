"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, FileCode, RefreshCw,  Copy, Download, AlertCircle, AlertTriangle, Info } from "lucide-react";
import Editor from "@monaco-editor/react";
import { getReviewById } from "@/libraries/review";
import { ReviewData } from "@/types";
import { toMonacoLanguage } from "@/libraries/language.detector";
import Loader from "@/components/ui/Loader";
import ScoreGauge from "@/components/review/score.gauge";
import IssueCard from "@/components/review/issue.card";
import StaticIssueCard from "@/components/review/static.issue.card";
import CodeMetricsPanel from "@/components/review/code.metrics.panel";
import ProtectedRoute from "@/components/auth/protected.route";
import { formatDate } from "@/libraries/utils";
import toast from "react-hot-toast";

function ReviewResultContent() {
    const params = useParams();
    const router = useRouter();
    const [review, setReview] = useState<ReviewData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
     const [copied, setCopied] = useState(false);

    useEffect(() => {
    let cancelled = false;

    const loadReview = async () => {
        try {
        const data = await getReviewById(params.id as string);

        if (!cancelled) {
            setReview(data);
        }
        } catch (error) {
        if (!cancelled) {
            toast.error((error as Error).message);
            router.push("/dashboard");
        }
        } finally {
        if (!cancelled) {
            setIsLoading(false);
        }
        }
    };
        loadReview();
        return () => {
            cancelled = true;
        };
        }, [params.id, router]);

   const copyCodeToClipboard = () => { 
    if (review?.code) { 
      navigator.clipboard.writeText(review.code); 
      setCopied(true); 
      setTimeout(() => setCopied(false), 2000); 
    } 
  }; 

  const downloadReview = () => { 
    if (!review) return; 
 
    const staticAnalysis = review.staticAnalysis; 
    const findings = staticAnalysis?.findings || []; 
    const metrics = staticAnalysis?.metrics; 
 
    const content = ` 

    CODE REVIEW REPORT
==================

File: ${review.fileName || "Untitled"}
Language: ${review.language}
Date: ${new Date(review.createdAt).toLocaleString()}
Overall Score: ${review.aiAnalysis?.overallScore || 0}/100


========== AI SUMMARY ==========

${review.aiAnalysis?.summary || "No AI summary available."}

AI Issues:
${review.aiAnalysis?.issues
  ?.map(
    (issue, index) =>
      `${index + 1}. [${issue.severity}] ${issue.title}
Line: ${issue.line}
${issue.description}
${
  issue.suggestion
    ? `Suggestion: ${issue.suggestion}`
    : ""
}
`
  )
  .join("\n") || "No AI issues found."}


========== STATIC ANALYSIS ==========

Total Issues: ${findings.length}
Code Quality Score: ${staticAnalysis?.score || 0}/100
 
--- Metrics ---
Cyclomatic Complexity: ${metrics?.cyclomaticComplexity || 0}
Lines of Code: ${metrics?.linesOfCode || 0}
Max Nesting Depth: ${metrics?.nestingDepth || 0}
Functions Found: ${metrics?.functions?.length || 0}
 
--- Issues Summary ---
Errors: ${findings.filter((f) => f.severity === "error").length}
Warnings: ${findings.filter((f) => f.severity === "warning").length}
Info: ${findings.filter((f) => f.severity === "info").length}
 

========== ORIGINAL CODE ==========

${review.code}
    `.trim(); 
 
    const blob = new Blob([content], { type: "text/plain" }); 
    const url = window.URL.createObjectURL(blob); 
    const a = document.createElement("a"); 
    a.href = url; 
    a.download = `review-${review._id}.txt`; 
    document.body.appendChild(a); 
    a.click(); 
    window.URL.revokeObjectURL(url); 
    document.body.removeChild(a); 
  }; 

  if (isLoading) {
    return <Loader fullScreen text="Loading review..." />;
  }

  if (!review) return null;

  const issues = review.aiAnalysis?.issues || [];
  const staticFindings = review.staticAnalysis?.findings || []; 
  const metrics = review.staticAnalysis?.metrics; 

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;

   const errorCount = staticFindings.filter( 
    (f) => f.severity === "error" 
  ).length; 
 
  const staticWarningCount = staticFindings.filter( 
    (f) => f.severity === "warning" 
  ).length; 
 
  const staticInfoCount = staticFindings.filter( 
    (f) => f.severity === "info" 
  ).length; 
 
   return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}

      <button
        onClick={() =>
          router.push("/dashboard")
        }
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {review.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4" />
              {review.fileName || "Untitled"}
            </span>

            <span className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4" />
              {review.language}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatDate(review.createdAt)}
            </span>

            {review.executionTimeMs && (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" />

                {(
                  review.executionTimeMs / 1000
                ).toFixed(1)}
                s analysis time
              </span>
            )}
          </div>
        </div>

        {/* Actions */}

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={copyCodeToClipboard}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />

            <span>
              {copied
                ? "Copied!"
                : "Copy Code"}
            </span>
          </button>

          <button
            onClick={downloadReview}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />

            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Failed */}

      {review.status === "failed" && (
        <div className="p-6 rounded-xl bg-danger/10 border border-danger/30 text-center mb-8">
          <p className="text-danger font-medium">
            This review failed to complete. The
            AI service may have been unavailable.
          </p>
        </div>
      )}

      {/* Completed Review */}

      {review.status === "completed" && (
        <>
          {/* AI Summary + Score */}

          {review.aiAnalysis && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2 p-6 rounded-xl bg-background-card border border-border">
                <h2 className="font-semibold mb-3">
                  AI Summary
                </h2>

                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  {review.aiAnalysis.summary}
                </p>

                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-danger" />
                    {criticalCount} Critical
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    {warningCount} Warning
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-info" />
                    {infoCount} Info
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center p-6 rounded-xl bg-background-card border border-border">
                <ScoreGauge
                  score={
                    review.aiAnalysis
                      .overallScore
                  }
                />
              </div>
            </div>
          )}

          {/* Main Content */}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left */}

            <div className="lg:col-span-2 space-y-6">
              {/* Submitted Code */}

              <div>
                <h2 className="font-semibold mb-3">
                  Submitted Code
                </h2>

                <div className="rounded-xl overflow-hidden border border-border">
                  <Editor
                    height="600px"
                    language={toMonacoLanguage(
                      review.language
                    )}
                    value={review.code}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      fontSize: 13,
                      minimap: {
                        enabled: false,
                      },
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>

              {/* AI Issues */}

              {review.aiAnalysis && (
                <div>
                  <h2 className="font-semibold mb-3">
                    AI Issues Found ({issues.length})
                  </h2>

                  {issues.length === 0 ? (
                    <div className="p-8 rounded-xl bg-background-card border border-border text-center">
                      <p className="text-gray-400">
                        🎉 No AI issues found! Your
                        code looks clean.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {issues.map(
                        (issue, index) => (
                          <IssueCard
                            key={index}
                            issue={issue}
                            index={index}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Static Analysis */}

              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-6">
                  Static Analysis Findings
                </h2>

                {/* Summary */}

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {/* Errors */}

                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />

                      <span className="text-red-400 text-xs font-medium uppercase">
                        Errors
                      </span>
                    </div>

                    <p className="text-red-300 text-2xl font-bold">
                      {errorCount}
                    </p>
                  </div>

                  {/* Warnings */}

                  <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />

                      <span className="text-yellow-400 text-xs font-medium uppercase">
                        Warnings
                      </span>
                    </div>

                    <p className="text-yellow-300 text-2xl font-bold">
                      {staticWarningCount}
                    </p>
                  </div>

                  {/* Info */}

                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-400" />

                      <span className="text-blue-400 text-xs font-medium uppercase">
                        Info
                      </span>
                    </div>

                    <p className="text-blue-300 text-2xl font-bold">
                      {staticInfoCount}
                    </p>
                  </div>
                </div>

                {/* Static Issues */}

                {staticFindings.length === 0 ? (
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-6 text-center">
                    <div className="inline-block mb-3">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <span className="text-3xl">
                          ✓
                        </span>
                      </div>
                    </div>

                    <p className="text-green-300 font-medium">
                      No static analysis issues
                      found!
                    </p>

                    <p className="text-green-200/70 text-sm mt-1">
                      Your code looks clean
                      according to ESLint and
                      complexity analysis.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
                    {staticFindings.map(
                      (finding, index) => (
                        <StaticIssueCard
                          key={index}
                          finding={finding}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Metrics */}

            <div className="lg:col-span-1">
              <CodeMetricsPanel
                metrics={metrics}
              />
            </div>
          </div>

          {/* Original Code */}

          <div className="mt-8 bg-slate-800/50 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Original Code
            </h3>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 overflow-x-auto max-h-96 overflow-y-auto">
              <pre className="text-slate-300 text-sm font-mono leading-relaxed">
                <code>
                  {review.code}
                </code>
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ReviewResultPage() {
  return (
    <ProtectedRoute>
      <ReviewResultContent />
    </ProtectedRoute>
  );
}


