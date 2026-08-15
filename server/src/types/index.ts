import { Document, Types } from "mongoose";

export enum SupportedLanguage {
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
  PYTHON = "python",
  JAVA = "java",
  CPP = "cpp",
  GO = "go",
  SQL = "sql",
  HTML = "html",
  CSS = "css",
}

export enum SeverityLevel {
  CRITICAL = "critical",
  WARNING = "warning",
  INFO = "info",
}

export enum ReviewStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface ICodeIssue {
  line: number;
  severity: SeverityLevel;
  title: string;
  description: string;
  suggestion?: string;
}

export interface IStaticAnalysisResult {
  complexity: number;
  unusedVariables: string[];
  issues: ICodeIssue[];
}

export interface IAiAnalysisResult {
  summary: string;
  issues: ICodeIssue[];
  overallScore: number; 
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  authProvider: "local" | "github";
  githubId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IReview extends Document {
  userId: Types.ObjectId;
  title: string;
  code: string;
  language: SupportedLanguage;
  fileName?: string;
  staticAnalysis?: IStaticAnalysisResult;
  aiAnalysis?: IAiAnalysisResult;
  status: ReviewStatus;
  executionTimeMs?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectFile {
  fileName: string;
  content: string;
  language: SupportedLanguage;
}

export interface IProject extends Document {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  files: IProjectFile[];
  createdAt: Date;
  updatedAt: Date;
}

