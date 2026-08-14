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
