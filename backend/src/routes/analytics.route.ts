import { Router } from 'express';
import * as AnalyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { sanitizeBody } from '../middlewares/validation.middleware';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

router.post('/mood', sanitizeBody, AnalyticsController.logMood);
router.get('/mood-trends', AnalyticsController.getMoodTrends);
router.get('/progress', AnalyticsController.getUserProgress);

export default router;
