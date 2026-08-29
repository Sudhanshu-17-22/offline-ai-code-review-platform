import mongoose, { Schema, model, Document } from "mongoose";
import { SupportedLanguage, ReviewStatus, SeverityLevel } from "@/types";
import { StaticAnalysisResult } from "../types";

interface IReview extends Document {
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

const codeIssueSchema = new Schema(
  {
    line: { type: Number, required: true },
    column: { type: Number },
    severity: { type: String, enum: Object.values(SeverityLevel), required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    suggestion: { type: String },
    rule: { type: String },
    type: { type: String },
    message: { type: String ,},
  },
  { _id: false } 
);

const staticAnalysisSchema = new Schema(
  {
    complexity: { type: Number, default: 0 },
    unusedVariables: { type: [String], default: [] },
    issues: { type: [codeIssueSchema], default: [] },
    findings: { type: [codeIssueSchema], default: [] },
    metrics: {
      cyclomaticComplexity: { type: Number, default: 0 },
      linesOfCode: { type: Number, default: 0 },
      nestingDepth: { type: Number, default: 0 },
      functions: [
        {
          name: { type: String, default: "" },
          complexity: { type: Number, default: 0 },
          lines: { type: Number, default: 0 },
        },
      ],
      duplicatePatterns: { type: [String], default: [] },
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  }, 
  { _id: false }
);

const aiAnalysisSchema = new Schema(
  {
    summary: { type: String, default: "" },
    correctedCode: { type: String, default: "" },
    issues: { type: [codeIssueSchema], default: [] },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false }
);

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Review",
    },
    code: {
      type: String,
      required: [true, "Code content is required"],
    },
    language: {
      type: String,
      enum: Object.values(SupportedLanguage),
      required: true,
    },
    fileName: {
      type: String,
      default: "",
    },
    staticAnalysis: {
      type: staticAnalysisSchema,
      default: undefined,
    },
    aiAnalysis: {
      type: aiAnalysisSchema,
      default: undefined,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(ReviewStatus),
      default: ReviewStatus.PENDING,
    },
    executionTimeMs: {
      type: Number,
      default: 0,
    },
    aiFindings: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ status: 1 });

export const Review = mongoose.models.Review || model<IReview>("Review", reviewSchema);
export default Review;



