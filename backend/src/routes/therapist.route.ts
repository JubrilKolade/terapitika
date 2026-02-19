import { Router } from 'express';
import * as TherapistController from '../controllers/therapist.controller';
import { authenticate, requireTherapist, requireAdmin } from '../middlewares/auth.middleware';
import { sanitizeBody, validatePaginationParams } from '../middlewares/validation.middleware';

const router = Router();

// Public routes
router.get('/search', validatePaginationParams, TherapistController.search);
router.get('/:id', TherapistController.getById);
router.get('/:id/availability', TherapistController.getAvailability);

// Therapist routes (requires therapist role)
router.post('/register', authenticate, sanitizeBody, TherapistController.register);
router.get('/me/profile', authenticate, requireTherapist, TherapistController.getProfile);
router.patch('/me/profile', authenticate, requireTherapist, sanitizeBody, TherapistController.updateProfile);
router.get('/me/stats', authenticate, requireTherapist, TherapistController.getStats);
router.patch('/me/availability', authenticate, requireTherapist, sanitizeBody, TherapistController.updateAvailability);
router.post('/me/documents', authenticate, requireTherapist, sanitizeBody, TherapistController.uploadDocuments);

// Admin routes
router.get('/pending/verifications', authenticate, requireAdmin, validatePaginationParams, TherapistController.getPendingVerifications);
router.patch('/:id/verify', authenticate, requireAdmin, sanitizeBody, TherapistController.verifyLicense);

export default router;
