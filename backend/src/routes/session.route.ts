import { Router } from 'express';
import * as SessionController from '../controllers/session.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/ai', authenticate, SessionController.createAISession);
router.post('/therapist', authenticate, SessionController.createTherapistSession);
router.get('/mine', authenticate, SessionController.getUserSessions);
router.get('/:id', authenticate, SessionController.getSession);
router.get('/:id/messages', authenticate, SessionController.getMessages);
router.post('/:id/notes', authenticate, SessionController.addNotes);
router.get('/:id/summary', authenticate, SessionController.getSummary);
router.get('/:id/transcript', authenticate, SessionController.getTranscript);
router.patch('/:id/end', authenticate, SessionController.endSession);
router.delete('/:id', authenticate, SessionController.cancelSession);

export default router;
