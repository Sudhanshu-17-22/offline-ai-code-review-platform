"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewStatus = exports.SeverityLevel = exports.SupportedLanguage = void 0;
var SupportedLanguage;
(function (SupportedLanguage) {
    SupportedLanguage["JAVASCRIPT"] = "javascript";
    SupportedLanguage["TYPESCRIPT"] = "typescript";
    SupportedLanguage["PYTHON"] = "python";
    SupportedLanguage["JAVA"] = "java";
    SupportedLanguage["CPP"] = "cpp";
    SupportedLanguage["GO"] = "go";
    SupportedLanguage["SQL"] = "sql";
    SupportedLanguage["HTML"] = "html";
    SupportedLanguage["CSS"] = "css";
})(SupportedLanguage || (exports.SupportedLanguage = SupportedLanguage = {}));
var SeverityLevel;
(function (SeverityLevel) {
    SeverityLevel["CRITICAL"] = "critical";
    SeverityLevel["WARNING"] = "warning";
    SeverityLevel["INFO"] = "info";
})(SeverityLevel || (exports.SeverityLevel = SeverityLevel = {}));
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "pending";
    ReviewStatus["PROCESSING"] = "processing";
    ReviewStatus["COMPLETED"] = "completed";
    ReviewStatus["FAILED"] = "failed";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
//# sourceMappingURL=index.js.map