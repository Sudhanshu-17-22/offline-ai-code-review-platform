"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tree_sitter_1 = __importDefault(require("tree-sitter"));
const tree_sitter_javascript_1 = __importDefault(require("tree-sitter-javascript"));
class ASTParserService {
    parser;
    constructor() {
        this.parser = new tree_sitter_1.default();
        this.parser.setLanguage(tree_sitter_javascript_1.default);
    }
    analyzeCodeMetrics(code) {
        const tree = this.parser.parse(code);
        const root = tree.rootNode;
        const metrics = {
            cyclomaticComplexity: this.calculateCyclomaticComplexity(root),
            linesOfCode: code.split("\n").length,
            nestingDepth: this.calculateNestingDepth(root),
            functions: this.extractFunctionMetrics(root),
            duplicatePatterns: this.findDuplicatePatterns(code),
        };
        return metrics;
    }
    calculateCyclomaticComplexity(node) {
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
        const traverse = (n) => {
            if (decisionKeywords.includes(n.type)) {
                complexity++;
            }
            if (n.type === "binary_expression" &&
                (n.child(1)?.text === "&&" || n.child(1)?.text === "||")) {
                complexity++;
            }
            for (const child of n.children) {
                traverse(child);
            }
        };
        traverse(node);
        return complexity;
    }
    calculateNestingDepth(node) {
        let maxDepth = 0;
        const traverse = (n, depth = 0) => {
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
    extractFunctionMetrics(node) {
        const functions = [];
        const traverse = (n) => {
            if (n.type === "function_declaration" ||
                n.type === "arrow_function" ||
                n.type === "method_definition") {
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
    extractFunctionName(node) {
        for (const child of node.children) {
            if (child.type === "identifier") {
                return child.text;
            }
        }
        return "anonymous";
    }
    findDuplicatePatterns(code) {
        const lines = code.split("\n");
        const patterns = [];
        const seen = new Map();
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
exports.default = new ASTParserService();
//# sourceMappingURL=ast.parser.service.js.map