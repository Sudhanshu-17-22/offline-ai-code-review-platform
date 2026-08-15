import { Schema, model } from "mongoose";
import { IReview, SupportedLanguage, ReviewStatus, SeverityLevel } from "@/types";

const codeIssueSchema = new Schema(
  {
    line: { type: Number, required: true },
    severity: {
      type: String,
      enum: Object.values(SeverityLevel),
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    suggestion: { type: String },
  },
  { _id: false } 
);

const staticAnalysisSchema = new Schema(
  {
    complexity: { type: Number, default: 0 },
    unusedVariables: { type: [String], default: [] },
    issues: { type: [codeIssueSchema], default: [] },
  },
  { _id: false }
);

const aiAnalysisSchema = new Schema(
  {
    summary: { type: String, default: "" },
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
    status: {
      type: String,
      enum: Object.values(ReviewStatus),
      default: ReviewStatus.PENDING,
    },
    executionTimeMs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ status: 1 });

export const Review = model<IReview>("Review", reviewSchema);




