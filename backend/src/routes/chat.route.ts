import { Router } from 'express';
import * as ChatController from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/send', authenticate, ChatController.sendMessage);
router.get('/:sessionId/history', authenticate, ChatController.getHistory);
router.patch('/messages/:id', authenticate, ChatController.editMessage);
router.delete('/messages/:id', authenticate, ChatController.deleteMessage);
router.patch('/:sessionId/read', authenticate, ChatController.markAsRead);
router.get('/:sessionId/unread', authenticate, ChatController.getUnreadCount);

export default router;
