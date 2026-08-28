"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileCode, TrendingUp, AlertCircle, Activity } from "lucide-react";
import { AuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/use.auth";
import { Review } from "@/types";
import StatsCard from "@/components/dashboard/stats.card";
import RecentReviews from "@/components/dashboard/recent.reviews";
import TopIssuesCard from "@/components/dashboard/top.issues.card";
import Button from "@/components/ui/Button";
import {
  fetchDashboardStats,
  fetchScoreTrend,
  fetchLanguageBreakdown,
  fetchTopIssues,
  fetchReviewHistory,
} from "@/libraries/api";

const ScoreTrendChart = dynamic(
  () => import("@/components/dashboard/score.trend.chart"),
  {
    loading: () => (
      <div className="h-64 bg-slate-800 rounded-lg animate-pulse" />
    ),
    ssr: false,
  }
);

const LanguageDistributionChart = dynamic(
  () => import("@/components/dashboard/language.distribution.chart"),
  {
    loading: () => (
      <div className="h-64 bg-slate-800 rounded-lg animate-pulse" />
    ),
    ssr: false,
  }
);

interface ScoreTrendPoint {
  date: string;
  score: number;
  count: number;
}

interface LanguageData {
  language: string;
  count: number;
  averageScore: number;
}

export interface TopIssue {
  rule: string;
  count: number;
}

export default function DashboardPage() {
  const { user } = AuthStore();
  const { logout } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [scoreTrend, setScoreTrend] = useState<ScoreTrendPoint[]>([]);
  const [languageData, setLanguageData] = useState<LanguageData[]>([]);
  const [topIssues, setTopIssues] = useState<TopIssue[]>([]);
  const [recentReviews, setRecentReviews] = useState<Partial<Review>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          statsData,
          trendData,
          langData,
          issuesData,
          reviewsData,
        ] = await Promise.all([
          fetchDashboardStats(),
          fetchScoreTrend(30),
          fetchLanguageBreakdown(),
          fetchTopIssues(5),
          fetchReviewHistory({ page: 1, limit: 5 }),
        ]);

        setStats(statsData);
        setScoreTrend(trendData);
        setLanguageData(langData);
        setTopIssues(issuesData);
        setRecentReviews(reviewsData.reviews);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-slate-400">
              Track your code quality progress over time
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={logout}
            >
              Logout
            </Button>

            <Button
              onClick={() => router.push("/review")}
              size="lg"
            >
              <Plus className="w-5 h-5" />
              New Review
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white">
            Welcome, {user?.name} 👋
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Reviews"
            value={loading ? "..." : Number(stats?.totalReviews ?? 0)}
            icon={<FileCode className="w-5 h-5" />}
            iconColor="text-blue-400"
          />

          <StatsCard
            title="Average Score"
            value={loading ? "..." : Number(stats?.averageScore ?? 0)}
            suffix="/100"
            icon={<TrendingUp className="w-5 h-5" />}
            iconColor="text-green-400"
            trend={
              typeof stats?.scoreImprovement === "number"
                ? stats.scoreImprovement
                : undefined
            }
          />

          <StatsCard
            title="Issues Found"
            value={loading ? "..." : Number(stats?.totalIssuesFound ?? 0)}
            icon={<AlertCircle className="w-5 h-5" />}
            iconColor="text-yellow-400"
          />

          <StatsCard
            title="Avg Complexity"
            value={loading ? "..." : Number(stats?.averageComplexity ?? 0)}
            icon={<Activity className="w-5 h-5" />}
            iconColor="text-purple-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ScoreTrendChart
            data={scoreTrend}
            loading={loading}
          />

          <LanguageDistributionChart
            data={languageData}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentReviews
            reviews={recentReviews}
            loading={loading}
          />

          <TopIssuesCard
            issues={topIssues}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}


