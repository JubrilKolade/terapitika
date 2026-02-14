import { Router } from 'express';
import * as SubscriptionController from '../controllers/subscription.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/plans', SubscriptionController.getPlans);
router.get('/mine', authenticate, SubscriptionController.getMine);
router.post('/subscribe', authenticate, SubscriptionController.subscribe);
router.patch('/upgrade', authenticate, SubscriptionController.upgrade);
router.delete('/cancel', authenticate, SubscriptionController.cancel);
router.get('/usage', authenticate, SubscriptionController.getUsage);

export default router;
