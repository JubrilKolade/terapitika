import { Router } from 'express';
import * as PaymentController from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/intent', authenticate, PaymentController.createIntent);
router.post('/confirm', authenticate, PaymentController.confirmPayment);
router.get('/history', authenticate, PaymentController.getHistory);
router.post('/refund', authenticate, PaymentController.processRefund);
router.get('/invoice/:id', authenticate, PaymentController.getInvoice);
router.post('/webhooks', PaymentController.handleWebhook);

export default router;
