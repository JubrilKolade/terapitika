import { Router } from 'express';
import * as VideoController from '../controllers/video.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/room/create', authenticate, VideoController.createRoom);
router.get('/room/:id/token', authenticate, VideoController.getToken);
router.delete('/room/:id', authenticate, VideoController.endRoom);
router.get('/room/:id/participants', authenticate, VideoController.getParticipants);
router.post('/voice/call/initiate', authenticate, VideoController.initiateVoiceCall);

export default router;
