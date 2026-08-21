export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type SeverityLevel = "critical" | "warning" | "info";

export interface CodeIssue {
  id: string;
  line: number;
  severity: SeverityLevel;
  title: string;
  description: string;
  suggestion?: string;
}

export interface Review {
  id: string;
  userId: string;
  code: string;
  language: SupportedLanguage;
  issues: CodeIssue[];
  status: "processing" | "completed" | "failed";
  createdAt: string;
}

export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "go"
  | "sql"
  | "html"
  | "css";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}


//  Authentication Types 
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}


export type ReviewStatus = "pending" | "processing" | "completed" | "failed";
export interface AiAnalysisResult {
  summary: string;
  overallScore: number;
  issues: CodeIssue[];
}

export interface ReviewData {
  _id: string;
  userId: string;
  title: string;
  code: string;
  language: SupportedLanguage;
  fileName?: string;
  aiAnalysis?: AiAnalysisResult;
  status: ReviewStatus;
  executionTimeMs?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
}


