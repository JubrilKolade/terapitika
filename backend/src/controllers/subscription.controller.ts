import { Response } from 'express';
import * as SubscriptionService from '../services/subscription.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';

export const getPlans = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const plans = await SubscriptionService.getPlans();
    return sendSuccess(res, plans);
});

export const subscribe = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { planType } = req.body;
    const subscription = await SubscriptionService.subscribe(req.user.id, planType);
    return sendSuccess(res, subscription, 'Subscribed successfully', 201);
});

export const cancel = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const subscription = await SubscriptionService.cancelSubscription(req.user.id);
    return sendSuccess(res, subscription, 'Subscription cancelled');
});

export const upgrade = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { planType } = req.body;
    const subscription = await SubscriptionService.upgradeSubscription(req.user.id, planType);
    return sendSuccess(res, subscription, 'Subscription upgraded');
});

export const getUsage = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const usage = await SubscriptionService.getUsageStats(req.user.id);
    return sendSuccess(res, usage);
});

export const getMine = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const sub = await SubscriptionService.getUserSubscription(req.user.id);
    return sendSuccess(res, sub);
});
