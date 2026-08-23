import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";
import { CodeMetrics } from "../types/index";

class ASTParserService {
    private parser: Parser;

    constructor() {
        this.parser = new Parser();
        this.parser.setLanguage(JavaScript);
    }
    analyzeCodeMetrics(code: string): CodeMetrics {
        const tree = this.parser.parse(code);
        const root = tree.rootNode;

        const metrics: CodeMetrics = {
            cyclomaticComplexity: this.calculateCyclomaticComplexity(root),
            linesOfCode: code.split("\n").length,
            nestingDepth: this.calculateNestingDepth(root),
            functions: this.extractFunctionMetrics(root),
            duplicatePatterns: this.findDuplicatePatterns(code),
        };
        return metrics;
    }

    private calculateCyclomaticComplexity(node: Parser.SyntaxNode): number {
        let complexity = 1;

        const decisionKeywords = [
            "if_statement",
            "for_statement",
            "while_statement",
            "do_statement",
            "switch_statement",
            "catch_clause",
            "conditional_expression",
        ];

        const traverse = (n: Parser.SyntaxNode) => {
            if (decisionKeywords.includes(n.type)) {
                complexity++;
            }

            if (
                n.type === "binary_expression" &&
                (n.child(1)?.text === "&&" || n.child(1)?.text === "||")
            ) {
                complexity++;
            }
            for (const child of n.children) {
                traverse(child);
            }
        };

        traverse(node);
        return complexity;
    }

    private calculateNestingDepth(node: Parser.SyntaxNode): number {
        let maxDepth = 0;

        const traverse = (n: Parser.SyntaxNode, depth: number = 0) => {
            if (["{", "(", "["].includes(n.text)) {
                maxDepth = Math.max(maxDepth, depth);
            }
            for (const child of n.children) {
                traverse(child, depth + 1);
            }
        };

        traverse(node);
        return maxDepth;
    }

    private extractFunctionMetrics(
        node: Parser.SyntaxNode
    ): CodeMetrics["functions"] {
        const functions: CodeMetrics["functions"] = [];

        const traverse = (n: Parser.SyntaxNode) => {
            if (
                n.type === "function_declaration" ||
                n.type === "arrow_function" ||
                n.type === "method_definition"
            ) {
                const name = this.extractFunctionName(n);
                const complexity = this.calculateCyclomaticComplexity(n);
                const lines = n.endPosition.row - n.startPosition.row + 1;

                functions.push({ name, complexity, lines });
            }

            for (const child of n.children) {
                traverse(child);
            }
        };

        traverse(node);
        return functions;
    }

    private extractFunctionName(node: Parser.SyntaxNode): string {
        for (const child of node.children) {
            if (child.type === "identifier") {
                return child.text;
            }
        }
        return "anonymous";
    }

    private findDuplicatePatterns(code: string): string[] {
        const lines = code.split("\n");
        const patterns: string[] = [];
        const seen = new Map<string, number>();

        for (let i = 0; i < lines.length - 1; i++) {
        const pair = `${lines[i]}\n${lines[i + 1]}`;
        seen.set(pair, (seen.get(pair) || 0) + 1);
        }

        for (const [pattern, count] of seen) {
            if (count >= 3) {
                patterns.push(pattern.slice(0, 50) + "..."); 
            }
        }
        return patterns;
    }
}
export default new ASTParserService();




