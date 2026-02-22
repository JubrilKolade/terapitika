import { Router } from 'express';
import * as PaymentController from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/intent', authenticate, PaymentController.createIntent);
router.post('/confirm', authenticate, PaymentController.confirmPayment);
router.get('/history', authenticate, PaymentController.getHistory);
router.post('/refund', authenticate, PaymentController.processRefund);
router.get('/invoice/:id', authenticate, PaymentController.getInvoice);

// Payment Method Management
router.get('/methods', authenticate, PaymentController.getPaymentMethods);
router.post('/methods', authenticate, PaymentController.addPaymentMethod);
router.delete('/methods/:id', authenticate, PaymentController.removePaymentMethod);
router.post('/methods/:id/default', authenticate, PaymentController.setDefaultPaymentMethod);

router.post('/webhooks', PaymentController.handleWebhook);

export default router;
