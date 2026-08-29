interface DashboardStats {
    totalReviews: number;
    averageScore: number;
    totalIssuesFound: number;
    averageComplexity: number;
    reviewsThisWeek: number;
    scoreImprovement: number;
}
interface ScoreTrendPoint {
    date: string;
    score: number;
    count: number;
}
interface LanguageBreakdown {
    language: string;
    count: number;
    averageScore: number;
}
interface SeverityBreakdown {
    severity: string;
    count: number;
}
declare class AnalyticsService {
    getDashboardStats(userId: string): Promise<DashboardStats>;
    getScoreTrend(userId: string, days?: number): Promise<ScoreTrendPoint[]>;
    getLanguageBreakdown(userId: string): Promise<LanguageBreakdown[]>;
    getSeverityBreakdown(userId: string): Promise<SeverityBreakdown[]>;
    getTopIssues(userId: string, limit?: number): Promise<{
        rule: string;
        count: number;
    }[]>;
}
declare const _default: AnalyticsService;
export default _default;
//# sourceMappingURL=analytics.service.d.ts.map