"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("@/types");
const codeIssueSchema = new mongoose_1.Schema({
    line: { type: Number, required: true },
    column: { type: Number },
    severity: {
        type: String,
        enum: Object.values(types_1.SeverityLevel),
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    suggestion: { type: String },
    rule: { type: String },
    type: { type: String },
    message: { type: String },
}, { _id: false });
const staticAnalysisSchema = new mongoose_1.Schema({
    complexity: { type: Number, default: 0 },
    unusedVariables: { type: [String], default: [] },
    issues: { type: [codeIssueSchema], default: [] },
    findings: { type: [codeIssueSchema], default: [] },
    metrics: {
        cyclomaticComplexity: { type: Number, default: 0 },
        linesOfCode: { type: Number, default: 0 },
        nestingDepth: { type: Number, default: 0 },
        functions: [
            {
                name: { type: String, default: "" },
                complexity: { type: Number, default: 0 },
                lines: { type: Number, default: 0 },
            },
        ],
        duplicatePatterns: { type: [String], default: [] },
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
}, { _id: false });
const aiAnalysisSchema = new mongoose_1.Schema({
    summary: { type: String, default: "" },
    correctedCode: { type: String, default: "" },
    issues: { type: [codeIssueSchema], default: [] },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
}, { _id: false });
const reviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        default: "Untitled Review",
    },
    code: {
        type: String,
        required: [true, "Code content is required"],
    },
    language: {
        type: String,
        enum: Object.values(types_1.SupportedLanguage),
        required: true,
    },
    fileName: {
        type: String,
        default: "",
    },
    staticAnalysis: {
        type: staticAnalysisSchema,
        default: undefined,
    },
    aiAnalysis: {
        type: aiAnalysisSchema,
        default: undefined,
    },
    overallScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    status: {
        type: String,
        enum: Object.values(types_1.ReviewStatus),
        default: types_1.ReviewStatus.PENDING,
    },
    executionTimeMs: {
        type: Number,
        default: 0,
    },
    aiFindings: {
        type: String,
        default: "",
    },
}, { timestamps: true });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ status: 1 });
exports.Review = mongoose_1.default.models.Review ||
    (0, mongoose_1.model)("Review", reviewSchema);
exports.default = exports.Review;
//# sourceMappingURL=review.model.js.map