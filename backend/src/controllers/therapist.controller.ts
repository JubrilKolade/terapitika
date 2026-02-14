import { Response } from 'express';
import { AuthRequest } from '../types';
import * as TherapistService from '../services/therapist.service';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';
import { logAuditEvent } from '../utils/logger';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const therapist = await TherapistService.registerTherapist(req.user.id, req.body);
  logAuditEvent(req.user.id, 'therapist_registered', 'therapist', therapist.id);
  return sendSuccess(res, therapist, 'Therapist registration submitted', 201);
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const therapist = await TherapistService.getTherapistByUserId(req.user.id);
  if (!therapist) return sendError(res, 'Therapist profile not found', 404);
  const updated = await TherapistService.updateProfile(therapist.id, req.body);
  return sendSuccess(res, updated, 'Profile updated');
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const therapist = await TherapistService.getTherapistByUserId(req.user.id);
  if (!therapist) return sendError(res, 'Therapist profile not found', 404);
  return sendSuccess(res, therapist);
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const therapist = await TherapistService.getTherapistById(id);
  if (!therapist) return sendError(res, 'Therapist not found', 404);
  return sendSuccess(res, therapist);
});

export const search = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { specialization, minRating, maxRate, languages, acceptsInsurance, isAcceptingClients, page = 1, limit = 20 } = req.query;
  const result = await TherapistService.searchTherapists({
    specialization: specialization as string,
    minRating: minRating ? parseFloat(minRating as string) : undefined,
    maxRate: maxRate ? parseFloat(maxRate as string) : undefined,
    languages: languages ? (languages as string).split(',') : undefined,
    acceptsInsurance: acceptsInsurance === 'true',
    isAcceptingClients: isAcceptingClients === 'true',
  }, parseInt(page as string), parseInt(limit as string));
  return sendSuccess(res, result);
});

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const therapist = await TherapistService.getTherapistByUserId(req.user.id);
  if (!therapist) return sendError(res, 'Therapist profile not found', 404);
  const stats = await TherapistService.getTherapistStats(therapist.id);
  return sendSuccess(res, stats);
});

export const updateAvailability = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const therapist = await TherapistService.getTherapistByUserId(req.user.id);
  if (!therapist) return sendError(res, 'Therapist profile not found', 404);
  const updated = await TherapistService.updateAvailability(therapist.id, req.body.schedule);
  return sendSuccess(res, updated, 'Availability updated');
});

export const uploadDocuments = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const therapist = await TherapistService.getTherapistByUserId(req.user.id);
  if (!therapist) return sendError(res, 'Therapist profile not found', 404);
  const updated = await TherapistService.uploadVerificationDocuments(therapist.id, req.body.documents);
  return sendSuccess(res, updated, 'Documents uploaded');
});

export const getPendingVerifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await TherapistService.getPendingVerifications(parseInt(page as string), parseInt(limit as string));
  return sendSuccess(res, result);
});

export const verifyLicense = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const { status, notes } = req.body;
  const therapist = await TherapistService.verifyLicense(id, status, notes);
  logAuditEvent(req.user?.id, 'therapist_verified', 'therapist', id, { status });
  return sendSuccess(res, therapist, 'Verification status updated');
});