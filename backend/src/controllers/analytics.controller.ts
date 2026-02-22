import { Response } from 'express';
import { AuthRequest } from '../types';
import * as AnalyticsService from '../services/analytics.service';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';

/**
 * Log user mood
 */
export const logMood = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const log = await AnalyticsService.logMood(req.user.id, req.body);
    return sendSuccess(res, log, 'Mood logged successfully', 201);
});

/**
 * Get mood trends
 */
export const getMoodTrends = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { startDate, endDate } = req.query;
    const trends = await AnalyticsService.getMoodTrends(
        req.user.id,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
    );
    return sendSuccess(res, trends);
});

/**
 * Get user progress
 */
export const getUserProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const progress = await AnalyticsService.getUserProgress(req.user.id);
    return sendSuccess(res, progress);
});
