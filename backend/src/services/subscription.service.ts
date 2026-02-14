import Stripe from 'stripe';
import { Subscription, User } from '../models';
import { SubscriptionStatus, ISubscription } from '../types';
import config from '../config/environment';
import logger from '../utils/logger';

const stripe = new Stripe(config.stripe.secretKey || '', { apiVersion: '2024-12-18.acacia' as any });

const PLANS: Record<string, { name: string; priceId: string; aiLimit: number | undefined; therapistHours: number | undefined }> = {
    free: { name: 'Free', priceId: '', aiLimit: 50, therapistHours: 0 },
    basic: { name: 'Basic', priceId: process.env.STRIPE_BASIC_PRICE_ID || '', aiLimit: 500, therapistHours: 2 },
    premium: { name: 'Premium', priceId: process.env.STRIPE_PREMIUM_PRICE_ID || '', aiLimit: undefined, therapistHours: 10 },
    unlimited: { name: 'Unlimited', priceId: process.env.STRIPE_UNLIMITED_PRICE_ID || '', aiLimit: undefined, therapistHours: undefined },
};

export const getPlans = async () => PLANS;

export const getUserSubscription = async (userId: string): Promise<ISubscription | null> => {
    const sub = await Subscription.findOne({ where: { user_id: userId } });
    return sub ? sub.toJSON() as ISubscription : null;
};

export const subscribe = async (userId: string, planType: string): Promise<ISubscription> => {
    const plan = PLANS[planType];
    if (!plan) throw new Error('Invalid plan type');

    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const existing = await Subscription.findOne({ where: { user_id: userId } });
    if (existing && existing.isActive()) throw new Error('Already has active subscription');

    let stripeSubId: string | undefined;
    let stripeCustomerId: string | undefined;

    if (planType !== 'free' && plan.priceId) {
        const customer = await stripe.customers.create({ email: user.email, metadata: { userId } });
        stripeCustomerId = customer.id;

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: plan.priceId }],
        });
        stripeSubId = subscription.id;
    }

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const sub = await Subscription.create({
        user_id: userId,
        plan_type: planType,
        stripe_subscription_id: stripeSubId,
        stripe_customer_id: stripeCustomerId,
        status: SubscriptionStatus.ACTIVE,
        current_period_start: now,
        current_period_end: periodEnd,
        cancel_at_period_end: false,
        ai_message_limit: plan.aiLimit,
        ai_messages_used: 0,
        monthly_therapist_hours: plan.therapistHours,
        monthly_therapist_hours_used: 0,
    });

    logger.info(`Subscription created: ${userId} -> ${planType}`);
    return sub.toJSON() as ISubscription;
};

export const cancelSubscription = async (userId: string): Promise<ISubscription> => {
    const sub = await Subscription.findOne({ where: { user_id: userId } });
    if (!sub) throw new Error('No subscription found');

    if (sub.stripe_subscription_id) {
        await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: true });
    }

    sub.cancel_at_period_end = true;
    sub.cancelled_at = new Date();
    await sub.save();
    return sub.toJSON() as ISubscription;
};

export const upgradeSubscription = async (userId: string, newPlanType: string): Promise<ISubscription> => {
    const sub = await Subscription.findOne({ where: { user_id: userId } });
    if (!sub) throw new Error('No subscription found');

    const plan = PLANS[newPlanType];
    if (!plan) throw new Error('Invalid plan type');

    sub.plan_type = newPlanType;
    sub.ai_message_limit = plan.aiLimit;
    sub.monthly_therapist_hours = plan.therapistHours;
    await sub.save();

    logger.info(`Subscription upgraded: ${userId} -> ${newPlanType}`);
    return sub.toJSON() as ISubscription;
};

export const incrementAIUsage = async (userId: string): Promise<boolean> => {
    const sub = await Subscription.findOne({ where: { user_id: userId } });
    if (!sub) return false;
    if (!sub.hasAIMessagesRemaining()) return false;
    sub.ai_messages_used += 1;
    await sub.save();
    return true;
};

export const getUsageStats = async (userId: string): Promise<any> => {
    const sub = await Subscription.findOne({ where: { user_id: userId } });
    if (!sub) return null;
    return {
        plan: sub.plan_type,
        aiMessages: { used: sub.ai_messages_used, limit: sub.ai_message_limit },
        therapistHours: { used: sub.monthly_therapist_hours_used, limit: sub.monthly_therapist_hours },
    };
};
