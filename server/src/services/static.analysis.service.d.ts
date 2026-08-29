import { StaticAnalysisResult } from "../types";
declare class StaticAnalysisService {
    analyzeCode(code: string, language: string): Promise<StaticAnalysisResult>;
    private runESLint;
    private extractComplexityWarnings;
    private calculateScore;
}
declare const _default: StaticAnalysisService;
export default _default;
//# sourceMappingURL=static.analysis.service.d.ts.map