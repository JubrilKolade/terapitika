import { Response } from 'express';
import * as VideoService from '../services/video.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';

export const createRoom = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { sessionId, maxParticipants } = req.body;
    const room = await VideoService.createRoom(sessionId, maxParticipants);
    return sendSuccess(res, room, 'Video room created', 201);
});

export const getToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params as { id: string };
    const token = VideoService.generateAccessToken(req.user.id, `session-${id}`);
    return sendSuccess(res, token);
});

export const endRoom = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    await VideoService.endRoom(id);
    return sendSuccess(res, null, 'Video room ended');
});

export const getParticipants = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const participants = await VideoService.getRoomParticipants(id);
    return sendSuccess(res, { participants });
});

export const initiateVoiceCall = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { to, sessionId } = req.body;
    const call = await VideoService.initiateVoiceCall(req.user.id, to, sessionId);
    return sendSuccess(res, call, 'Voice call initiated', 201);
});
