import { Router } from 'express';
import * as SupportController from '../controllers/support.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/tickets', authenticate, SupportController.createTicket);
router.get('/tickets', authenticate, SupportController.getTickets);
router.get('/tickets/:id', authenticate, SupportController.getTicket);
router.patch('/tickets/:id', authenticate, SupportController.updateTicket);
router.post('/tickets/:id/messages', authenticate, SupportController.addMessage);
router.post('/tickets/:id/close', authenticate, SupportController.closeTicket);

export default router;
