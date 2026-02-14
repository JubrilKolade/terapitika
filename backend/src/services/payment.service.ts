import Stripe from 'stripe';
import { Payment, User } from '../models';
import { PaymentStatus, IPayment } from '../types';
import config from '../config/environment';
import logger from '../utils/logger';

const stripe = new Stripe(config.stripe?.secretKey || '', { apiVersion: '2025-01-27.acacia' as any });

export const createPaymentIntent = async (data: {
    userId: string;
    therapistId?: string;
    sessionId?: string;
    amount: number;
    currency?: string;
}): Promise<{ clientSecret: string; paymentId: string }> => {
    const user = await User.findByPk(data.userId);
    if (!user) throw new Error('User not found');

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100),
        currency: data.currency || 'usd',
        metadata: {
            userId: data.userId,
            therapistId: data.therapistId || '',
            sessionId: data.sessionId || '',
        },
    });

    const payment = await Payment.create({
        user_id: data.userId,
        therapist_id: data.therapistId,
        session_id: data.sessionId,
        amount: data.amount,
        currency: data.currency || 'USD',
        payment_method: 'stripe',
        stripe_payment_intent_id: paymentIntent.id,
        status: PaymentStatus.PENDING,
    });

    logger.info(`Payment intent created: ${paymentIntent.id}`);
    return { clientSecret: paymentIntent.client_secret!, paymentId: payment.id };
};

export const confirmPayment = async (paymentIntentId: string): Promise<IPayment> => {
    const payment = await Payment.findOne({
        where: { stripe_payment_intent_id: paymentIntentId },
    });
    if (!payment) throw new Error('Payment not found');

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
        payment.status = PaymentStatus.SUCCEEDED;
        payment.stripe_charge_id = paymentIntent.latest_charge as string;
    } else {
        payment.status = PaymentStatus.FAILED;
        payment.failure_reason = 'Payment not completed';
    }

    await payment.save();
    return payment.toJSON() as IPayment;
};

export const processRefund = async (paymentId: string, amount?: number): Promise<IPayment> => {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== PaymentStatus.SUCCEEDED) throw new Error('Can only refund successful payments');

    const refundAmount = amount || payment.amount;

    await stripe.refunds.create({
        payment_intent: payment.stripe_payment_intent_id!,
        amount: Math.round(Number(refundAmount) * 100),
    });

    payment.status = PaymentStatus.REFUNDED;
    payment.refund_amount = refundAmount;
    payment.refunded_at = new Date();
    await payment.save();

    logger.info(`Payment refunded: ${paymentId}`);
    return payment.toJSON() as IPayment;
};

export const getPaymentHistory = async (userId: string, page = 1, limit = 20): Promise<{ payments: IPayment[]; total: number }> => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Payment.findAndCountAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit, offset,
    });
    return { payments: rows.map(p => p.toJSON() as IPayment), total: count };
};

export const getPaymentById = async (paymentId: string): Promise<IPayment | null> => {
    const payment = await Payment.findByPk(paymentId);
    return payment ? payment.toJSON() as IPayment : null;
};

export const handleWebhook = async (event: Stripe.Event): Promise<void> => {
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const intent = event.data.object as Stripe.PaymentIntent;
            await confirmPayment(intent.id);
            break;
        }
        case 'payment_intent.payment_failed': {
            const intent = event.data.object as Stripe.PaymentIntent;
            const payment = await Payment.findOne({ where: { stripe_payment_intent_id: intent.id } });
            if (payment) {
                payment.status = PaymentStatus.FAILED;
                payment.failure_reason = (intent.last_payment_error as any)?.message || 'Payment failed';
                await payment.save();
            }
            break;
        }
        default:
            logger.debug(`Unhandled webhook event: ${event.type}`);
    }
};
