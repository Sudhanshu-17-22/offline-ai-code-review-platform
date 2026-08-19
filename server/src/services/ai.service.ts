import { ollamaService } from "@/services/ollama.service";
import { buildCodeReviewPrompt } from "@/utils/prompts";
import { SupportedLanguage, IAiAnalysisResult, SeverityLevel } from "@/types";
import { logger } from "@/utils/logger";
import { ApiError } from "@/utils/ApiError";

class AiService {
    async reviewCode(
        code: string,
        language: SupportedLanguage
    ): Promise<IAiAnalysisResult> {
        const prompt = buildCodeReviewPrompt(code, language);

        logger.info(`🤖 Sending code to AI model for review (language: ${language})`);
        const rawResponse = await ollamaService.generate(prompt);
        return this.parseAiResponse(rawResponse);
    }
    private parseAiResponse(rawResponse: string): IAiAnalysisResult {
        try {
        const cleaned = rawResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON object found in AI response");
        }

        const parsed = JSON.parse(jsonMatch[0]);
        const result: IAiAnalysisResult = {
            summary: parsed.summary || "No summary provided.",
            overallScore:
            typeof parsed.overallScore === "number" ? parsed.overallScore : 50,
            issues: Array.isArray(parsed.issues)
            ? parsed.issues.map((issue: Record<string, unknown>) => ({
                line: typeof issue.line === "number" ? issue.line : 1,
                severity: this.normalizeSeverity(issue.severity as string),
                title: (issue.title as string) || "Untitled Issue",
                description: (issue.description as string) || "",
                suggestion: (issue.suggestion as string) || "",
                }))
            : [],
        };
        return result;
        } catch (error) {
        logger.error(`Failed to parse AI response: ${(error as Error).message}`);
        logger.error(`Raw response was: ${rawResponse.slice(0, 500)}`);

        throw new ApiError(
            502,
            "AI returned an unexpected response format. Please try again."
        );
        }
    }
    private normalizeSeverity(value: string): SeverityLevel {
        const valid = Object.values(SeverityLevel);
        return valid.includes(value as SeverityLevel)
        ? (value as SeverityLevel)
        : SeverityLevel.INFO;
    }
}
export const aiService = new AiService();


