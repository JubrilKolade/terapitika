import { Response } from 'express';
import { AuthRequest } from '../types';
import * as BookingService from '../services/booking.service';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';
import { logAuditEvent } from '../utils/logger';

export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const { therapistId, scheduledAt, duration, communicationMode, notes } = req.body;
  const booking = await BookingService.createBooking(req.user.id, {
    therapistId,
    scheduledAt: new Date(scheduledAt),
    duration,
    communicationMode,
    notes,
  });
  logAuditEvent(req.user.id, 'booking_created', 'session', booking.id);
  return sendSuccess(res, booking, 'Booking created successfully', 201);
});

export const getAvailableSlots = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { therapistId, date, duration = 60 } = req.query;
  if (!therapistId || !date) return sendError(res, 'Therapist ID and date are required', 400);
  const slots = await BookingService.getAvailableSlots(
    therapistId as string,
    new Date(date as string),
    parseInt(duration as string)
  );
  return sendSuccess(res, { slots });
});

export const getBookingById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const { id } = req.params as { id: string };
  const booking = await BookingService.getBookingById(id, req.user.id, req.user.role as string);
  if (!booking) return sendError(res, 'Booking not found', 404);
  return sendSuccess(res, booking);
});

export const getUserBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const { status, page = 1, limit = 20 } = req.query;
  const result = await BookingService.getUserBookings(
    req.user.id,
    status as any,
    parseInt(page as string),
    parseInt(limit as string)
  );
  return sendSuccess(res, result);
});

export const cancelBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const { id } = req.params as { id: string };
  const { reason } = req.body;
  const booking = await BookingService.cancelBooking(id, req.user.id, reason);
  logAuditEvent(req.user.id, 'booking_cancelled', 'session', id);
  return sendSuccess(res, booking, 'Booking cancelled');
});

export const rescheduleBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const { id } = req.params as { id: string };
  const { scheduledAt } = req.body;
  const booking = await BookingService.rescheduleBooking(id, req.user.id, new Date(scheduledAt));
  logAuditEvent(req.user.id, 'booking_rescheduled', 'session', id);
  return sendSuccess(res, booking, 'Booking rescheduled');
});

export const startSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const session = await BookingService.startSession(id);
  logAuditEvent(req.user?.id, 'session_started', 'session', id);
  return sendSuccess(res, session, 'Session started');
});

export const endSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const session = await BookingService.endSession(id);
  logAuditEvent(req.user?.id, 'session_ended', 'session', id);
  return sendSuccess(res, session, 'Session ended');
});