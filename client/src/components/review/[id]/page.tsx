"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, FileCode, RefreshCw } from "lucide-react";
import Editor from "@monaco-editor/react";
import { getReviewById } from "@/libraries/review";
import { ReviewData } from "@/types";
import { toMonacoLanguage } from "@/libraries/language.detector";
import Loader from "@/components/ui/Loader";
import ScoreGauge from "@/components/review/score.gauge";
import IssueCard from "@/components/review/issue.card";
import ProtectedRoute from "@/components/auth/protected.route";
import { formatDate } from "@/libraries/utils";
import toast from "react-hot-toast";

function ReviewResultContent() {
    const params = useParams();
    const router = useRouter();
    const [review, setReview] = useState<ReviewData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <Loader fullScreen text="Loading review..." />;
  }

  if (!review) return null;

  const issues = review.aiAnalysis?.issues || [];
  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{review.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
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
                {(review.executionTimeMs / 1000).toFixed(1)}s analysis time
              </span>
            )}
          </div>
        </div>
      </div>

      {review.status === "failed" && (
        <div className="p-6 rounded-xl bg-danger/10 border border-danger/30 text-center mb-8">
          <p className="text-danger font-medium">
            This review failed to complete. The AI service may have been unavailable.
          </p>
        </div>
      )}

      {review.status === "completed" && review.aiAnalysis && (
        <>
          {/* Summary + Score Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 p-6 rounded-xl bg-background-card border border-border">
              <h2 className="font-semibold mb-3">AI Summary</h2>
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
              <ScoreGauge score={review.aiAnalysis.overallScore} />
            </div>
          </div>

          {/* Code + Issues Side by Side */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-3">Submitted Code</h2>
              <div className="rounded-xl overflow-hidden border border-border">
                <Editor
                  height="600px"
                  language={toMonacoLanguage(review.language)}
                  value={review.code}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-3">
                Issues Found ({issues.length})
              </h2>
              {issues.length === 0 ? (
                <div className="p-8 rounded-xl bg-background-card border border-border text-center">
                  <p className="text-gray-400">
                    🎉 No issues found! Your code looks clean.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {issues.map((issue, index) => (
                    <IssueCard key={index} issue={issue} index={index} />
                  ))}
                </div>
              )}
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





