import { SupportedLanguage } from "@/types";

export const buildCodeReviewPrompt = (
  code: string,
  language: SupportedLanguage
): string => {
  return `You are an expert senior software engineer performing a code review.

Analyze the following ${language} code and identify issues related to:
- Logic errors or bugs
- Security vulnerabilities
- Performance problems
- Bad practices or anti-patterns
- Readability and maintainability

CODE TO REVIEW:
\`\`\`${language}
${code}
\`\`\`

Respond ONLY with valid JSON in this EXACT structure, with no extra text before or after:

{
  "summary": "A 2-3 sentence overall assessment of the code quality",
  "overallScore": <a number from 0 to 100 representing code quality>,
  "issues": [
    {
      "line": <line number where the issue occurs, use 1 if not line-specific>,
      "severity": "critical" | "warning" | "info",
      "title": "Short title of the issue",
      "description": "Clear explanation of what's wrong and why it matters",
      "suggestion": "A specific code-level suggestion to fix it"
    }
  ]
}

Rules:
- If the code has no issues, return an empty "issues" array but still provide a summary and score.
- Be specific — reference actual variable/function names from the code.
- Do not include markdown formatting, backticks, or explanations outside the JSON.`;
};

export const buildQuickCheckPrompt = (code: string, language: SupportedLanguage): string => {
  return `Quickly scan this ${language} code for any obvious syntax errors only. Respond with a single sentence.

\`\`\`${language}
${code}
\`\`\``;
};




