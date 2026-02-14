import { Router } from 'express';
import * as NotificationController from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, NotificationController.getAll);
router.get('/unread', authenticate, NotificationController.getUnread);
router.patch('/:id/read', authenticate, NotificationController.markAsRead);
router.patch('/read-all', authenticate, NotificationController.markAllAsRead);
router.delete('/:id', authenticate, NotificationController.deleteNotification);

export default router;
