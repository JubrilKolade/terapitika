import { Router } from 'express';
import * as ReviewController from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, ReviewController.create);
router.get('/therapist/:id', ReviewController.getTherapistReviews);
router.patch('/:id', authenticate, ReviewController.update);
router.delete('/:id', authenticate, ReviewController.deleteReview);
router.post('/:id/respond', authenticate, ReviewController.respond);

export default router;
