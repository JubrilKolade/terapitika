import { Response } from 'express';
import * as PaymentService from '../services/payment.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';
import { logAuditEvent } from '../utils/logger';

export const createIntent = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { therapistId, sessionId, amount, currency } = req.body;
    const result = await PaymentService.createPaymentIntent({
        userId: req.user.id, therapistId, sessionId, amount, currency,
    });
    logAuditEvent(req.user.id, 'payment_intent_created', 'payment', result.paymentId);
    return sendSuccess(res, result, 'Payment intent created', 201);
});

export const confirmPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { paymentIntentId } = req.body;
    const payment = await PaymentService.confirmPayment(paymentIntentId);
    return sendSuccess(res, payment);
});

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const page = parseInt(req.query.page as string) || 1;
    const result = await PaymentService.getPaymentHistory(req.user.id, page);
    return sendSuccess(res, result);
});

export const processRefund = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { paymentId, amount } = req.body;
    const payment = await PaymentService.processRefund(paymentId, amount);
    logAuditEvent(req.user?.id, 'payment_refunded', 'payment', paymentId);
    return sendSuccess(res, payment);
});

export const getInvoice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const payment = await PaymentService.getPaymentById(id);
    if (!payment) return sendError(res, 'Payment not found', 404);
    return sendSuccess(res, payment);
});

export const handleWebhook = asyncHandler(async (req: any, res: Response) => {
    const stripe = require('stripe');
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    await PaymentService.handleWebhook(event);
    return res.json({ received: true });
});
export const getPaymentMethods = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const methods = await PaymentService.getPaymentMethods(req.user.id);
    return sendSuccess(res, methods);
});

export const addPaymentMethod = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { paymentMethodId } = req.body;
    const method = await PaymentService.addPaymentMethod(req.user.id, paymentMethodId);
    return sendSuccess(res, method, 'Payment method added');
});

export const removePaymentMethod = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await PaymentService.removePaymentMethod(id as string);
    return sendSuccess(res, null, 'Payment method removed');
});

export const setDefaultPaymentMethod = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params;
    await PaymentService.setDefaultPaymentMethod(req.user.id, id as string);
    return sendSuccess(res, null, 'Default payment method updated');
});
