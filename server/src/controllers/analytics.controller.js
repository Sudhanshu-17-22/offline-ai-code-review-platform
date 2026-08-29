"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopIssues = exports.getSeverityBreakdown = exports.getLanguageBreakdown = exports.getScoreTrend = exports.getDashboardStats = void 0;
const analytics_service_1 = __importDefault(require("../services/analytics.service"));
const response_handler_1 = require("../utils/response.handler");
const getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const stats = await analytics_service_1.default.getDashboardStats(userId);
        return res
            .status(200)
            .json(new response_handler_1.ApiResponse(200, stats, "Dashboard stats retrieved"));
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
const getScoreTrend = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const days = parseInt(req.query.days) || 30;
        const trend = await analytics_service_1.default.getScoreTrend(userId, days);
        return res
            .status(200)
            .json(new response_handler_1.ApiResponse(200, trend, "Score trend retrieved"));
    }
    catch (error) {
        next(error);
    }
};
exports.getScoreTrend = getScoreTrend;
const getLanguageBreakdown = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const breakdown = await analytics_service_1.default.getLanguageBreakdown(userId);
        return res
            .status(200)
            .json(new response_handler_1.ApiResponse(200, breakdown, "Language breakdown retrieved"));
    }
    catch (error) {
        next(error);
    }
};
exports.getLanguageBreakdown = getLanguageBreakdown;
const getSeverityBreakdown = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const breakdown = await analytics_service_1.default.getSeverityBreakdown(userId);
        return res
            .status(200)
            .json(new response_handler_1.ApiResponse(200, breakdown, "Severity breakdown retrieved"));
    }
    catch (error) {
        next(error);
    }
};
exports.getSeverityBreakdown = getSeverityBreakdown;
const getTopIssues = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit) || 5;
        const topIssues = await analytics_service_1.default.getTopIssues(userId, limit);
        return res
            .status(200)
            .json(new response_handler_1.ApiResponse(200, topIssues, "Top issues retrieved"));
    }
    catch (error) {
        next(error);
    }
};
exports.getTopIssues = getTopIssues;
//# sourceMappingURL=analytics.controller.js.map