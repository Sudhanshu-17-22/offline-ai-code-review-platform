"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_1 = require("eslint");
const typescript_eslint_1 = __importDefault(require("typescript-eslint"));
const ast_parser_service_1 = __importDefault(require("./ast.parser.service"));
const eslint = new eslint_1.ESLint({
    overrideConfigFile: true,
    overrideConfig: [{
            files: ["**/*.{js,jsx,ts,tsx}"],
            plugins: {
                "@typescript-eslint": typescript_eslint_1.default.plugin,
            },
            languageOptions: {
                parser: typescript_eslint_1.default.parser,
                parserOptions: {
                    ecmaVersion: 2021,
                    sourceType: "module",
                },
                globals: {
                    console: "readonly",
                    window: "readonly",
                    document: "readonly",
                    process: "readonly",
                },
            },
            rules: {
                "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
                "no-console": ["warn"],
                "prefer-const": "warn",
                "eqeqeq": ["warn", "always"],
                "no-var": "warn",
                "prefer-arrow-callback": "warn",
                "no-implicit-coercion": "warn",
                "no-eval": "error",
                "no-implied-eval": "error",
                "no-with": "error",
                "no-prototype-builtins": "warn",
                "@typescript-eslint/no-explicit-any": "warn",
                "@typescript-eslint/no-non-null-assertion": "warn",
            },
        }],
});
class StaticAnalysisService {
    async analyzeCode(code, language) {
        try {
            const eslintFindings = await this.runESLint(code);
            let metrics = {
                cyclomaticComplexity: 0,
                linesOfCode: 0,
                nestingDepth: 0,
                functions: [],
                duplicatePatterns: [],
            };
            if (language === "javascript" || language === "typescript") {
                metrics = ast_parser_service_1.default.analyzeCodeMetrics(code);
            }
            const allFindings = [
                ...eslintFindings,
                ...this.extractComplexityWarnings(metrics),
            ];
            const score = this.calculateScore(allFindings, metrics);
            return {
                findings: allFindings,
                metrics,
                score,
            };
        }
        catch (error) {
            console.error("Static analysis error:", error);
            return {
                findings: [],
                metrics: {
                    cyclomaticComplexity: 0,
                    linesOfCode: code.split("\n").length,
                    nestingDepth: 0,
                    functions: [],
                    duplicatePatterns: [],
                },
                score: 50,
            };
        }
    }
    async runESLint(code) {
        const results = await eslint.lintText(code);
        const findings = [];
        for (const result of results) {
            for (const message of result.messages) {
                findings.push({
                    type: "eslint",
                    severity: message.severity === 2 ? "error" : "warning",
                    rule: message.ruleId ?? "unknown",
                    message: message.message,
                    line: message.line ?? 0,
                    column: message.column ?? 0,
                    ...(message.fix
                        ? {
                            fix: {
                                range: [
                                    message.fix.range[0],
                                    message.fix.range[1],
                                ],
                                text: message.fix.text,
                            },
                        }
                        : {}),
                });
            }
        }
        return findings;
    }
    extractComplexityWarnings(metrics) {
        const warnings = [];
        if (metrics.cyclomaticComplexity > 10) {
            warnings.push({
                type: "complexity",
                severity: "warning",
                rule: "high-cyclomatic-complexity",
                message: `High cyclomatic complexity: ${metrics.cyclomaticComplexity}. Consider refactoring.`,
                line: 1,
                column: 0,
            });
        }
        if (metrics.nestingDepth > 4) {
            warnings.push({
                type: "complexity",
                severity: "warning",
                rule: "high-nesting-depth",
                message: `High nesting depth: ${metrics.nestingDepth}. Consider extracting functions.`,
                line: 1,
                column: 0,
            });
        }
        for (const fn of metrics.functions) {
            if (fn.complexity > 8) {
                warnings.push({
                    type: "complexity",
                    severity: "warning",
                    rule: "function-complexity",
                    message: `Function "${fn.name}" has high complexity (${fn.complexity}). Consider breaking it down.`,
                    line: 1,
                    column: 0,
                });
            }
            if (fn.lines > 100) {
                warnings.push({
                    type: "complexity",
                    severity: "info",
                    rule: "large-function",
                    message: `Function "${fn.name}" is ${fn.lines} lines. Consider splitting into smaller functions.`,
                    line: 1,
                    column: 0,
                });
            }
        }
        if (metrics.duplicatePatterns.length > 0) {
            warnings.push({
                type: "dead-code",
                severity: "info",
                rule: "duplicate-code",
                message: `Found ${metrics.duplicatePatterns.length} duplicate code patterns. Consider DRY principle.`,
                line: 1,
                column: 0,
            });
        }
        return warnings;
    }
    calculateScore(findings, metrics) {
        let score = 100;
        const errors = findings.filter((f) => f.severity === "error").length;
        score -= errors * 5;
        const warnings = findings.filter((f) => f.severity === "warning").length;
        score -= warnings * 2;
        if (metrics.cyclomaticComplexity > 15)
            score -= 10;
        if (metrics.nestingDepth > 5)
            score -= 5;
        if (findings.length === 0)
            score = Math.min(score + 5, 100);
        return Math.max(score, 0);
    }
}
exports.default = new StaticAnalysisService();
//# sourceMappingURL=static.analysis.service.js.map