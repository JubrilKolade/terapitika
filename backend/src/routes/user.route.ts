import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { sanitizeBody, validatePaginationParams } from '../middlewares/validation.middleware';

const router = Router();

// Protected routes (user must be authenticated)
router.get('/me', authenticate, UserController.getProfile);
router.patch('/me', authenticate, sanitizeBody, UserController.updateProfile);
router.post('/me/profile-picture', authenticate, sanitizeBody, UserController.updateProfilePicture);
router.patch('/me/preferences', authenticate, sanitizeBody, UserController.updatePreferences);
router.get('/me/stats', authenticate, UserController.getStats);
router.post('/me/deactivate', authenticate, UserController.deactivateAccount);
router.delete('/me', authenticate, UserController.deleteAccount);

// Admin only routes
router.get('/search', authenticate, requireAdmin, validatePaginationParams, UserController.searchUsers);
router.get('/', authenticate, requireAdmin, validatePaginationParams, UserController.getAllUsers);

export default router;