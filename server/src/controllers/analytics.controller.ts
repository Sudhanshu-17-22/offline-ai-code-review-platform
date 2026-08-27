import { Request, Response, NextFunction } from "express";
import analyticsService from "../services/analytics.service";
import { ApiResponse } from "../utils/response.handler";

interface AuthRequest extends Request {
    user?: { id: string };
}

export const getDashboardStats = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id as string;
        const stats = await analyticsService.getDashboardStats(userId);

        return res
        .status(200)
        .json(new ApiResponse(200, stats, "Dashboard stats retrieved"));
    } 
    catch (error) {
        next(error);
    }
};

export const getScoreTrend = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id as string;
        const days = parseInt(req.query.days as string) || 30;

        const trend = await analyticsService.getScoreTrend(userId, days);

        return res
        .status(200)
        .json(new ApiResponse(200, trend, "Score trend retrieved"));
    } 
    catch (error) {
        next(error);
    }
};

export const getLanguageBreakdown = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id as string;
        const breakdown = await analyticsService.getLanguageBreakdown(userId);

        return res
        .status(200)
        .json(new ApiResponse(200, breakdown, "Language breakdown retrieved"));
    } 
    catch (error) {
        next(error);
    }
};

export const getSeverityBreakdown = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id as string;
        const breakdown = await analyticsService.getSeverityBreakdown(userId);

        return res
        .status(200)
        .json(
            new ApiResponse(200, breakdown, "Severity breakdown retrieved")
        );
    } 
    catch (error) {
        next(error);
    }
};

export const getTopIssues = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id as string;
        const limit = parseInt(req.query.limit as string) || 5;

        const topIssues = await analyticsService.getTopIssues(userId, limit);

        return res
        .status(200)
        .json(new ApiResponse(200, topIssues, "Top issues retrieved"));
    } 
    catch (error) {
        next(error);
    }
};










