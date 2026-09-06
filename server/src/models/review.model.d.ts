import mongoose from "mongoose";
import { ReviewStatus, SeverityLevel } from "@/types";
import { StaticAnalysisResult } from "../types";
interface IReview {
    userId: mongoose.Types.ObjectId;
    title: string;
    code: string;
    language: string;
    fileName?: string;
    aiFindings: string;
    aiAnalysis?: {
        summary: string;
        correctedCode: string;
        issues: Array<{
            line: number;
            column?: number;
            severity: SeverityLevel;
            title: string;
            description: string;
            suggestion?: string;
            rule?: string;
            type?: string;
            message?: string;
        }>;
        overallScore: number;
    };
    staticAnalysis?: StaticAnalysisResult;
    overallScore: number;
    status: ReviewStatus;
    executionTimeMs: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Review: mongoose.Model<IReview, {}, {}, {}, mongoose.Document<unknown, {}, IReview, {}, mongoose.DefaultSchemaOptions> & IReview & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IReview>;
export default Review;
//# sourceMappingURL=review.model.d.ts.map