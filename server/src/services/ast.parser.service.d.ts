import { CodeMetrics } from "../types/index";
declare class ASTParserService {
    private parser;
    constructor();
    analyzeCodeMetrics(code: string): CodeMetrics;
    private calculateCyclomaticComplexity;
    private calculateNestingDepth;
    private extractFunctionMetrics;
    private extractFunctionName;
    private findDuplicatePatterns;
}
declare const _default: ASTParserService;
export default _default;
//# sourceMappingURL=ast.parser.service.d.ts.map