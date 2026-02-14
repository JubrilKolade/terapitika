import { Router } from 'express';
import * as AdminController from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { UserRole } from '../types';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireRole(UserRole.ADMIN));

router.get('/analytics', AdminController.getDashboard);
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUser);
router.patch('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);
router.get('/therapists/pending', AdminController.getPendingVerifications);
router.patch('/therapists/:id/verify', AdminController.verifyTherapist);
router.get('/crisis-logs', AdminController.getCrisisLogs);
router.get('/audit-logs', AdminController.getAuditLogs);
router.post('/broadcast', AdminController.broadcast);

export default router;
