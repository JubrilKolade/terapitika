import { Session, Therapist, User } from '../models';
import {
  SessionType,
  SessionStatus,
  CommunicationMode,
  ISession
} from '../types';
import logger from '../utils/logger';
import { Op } from 'sequelize';

/**
 * Create booking/session
 */
export const createBooking = async (
  clientId: string,
  data: {
    therapistId: string;
    scheduledAt: Date;
    duration: number;
    communicationMode: CommunicationMode;
    notes?: string;
  }
): Promise<ISession> => {
  const therapist = await Therapist.findByPk(data.therapistId);
  if (!therapist) throw new Error('Therapist not found');
  if (!therapist.isVerified()) throw new Error('Therapist is not verified');
  if (!therapist.canAcceptClients()) throw new Error('Therapist is not accepting new clients');

  const conflictingSession = await Session.findOne({
    where: {
      therapist_id: data.therapistId,
      scheduled_at: data.scheduledAt,
      status: [SessionStatus.SCHEDULED, SessionStatus.IN_PROGRESS],
    },
  });
  if (conflictingSession) throw new Error('Time slot is not available');

  const session = await Session.create({
    client_id: clientId,
    therapist_id: data.therapistId,
    session_type: SessionType.HUMAN_THERAPIST,
    communication_mode: data.communicationMode,
    scheduled_at: data.scheduledAt,
    status: SessionStatus.SCHEDULED,
    duration_minutes: data.duration,
  });

  const sessionCost = therapist.getAverageSessionRate(data.duration);
  session.payment_amount = sessionCost;
  session.payment_status = 'pending';
  await session.save();

  logger.info(`Booking created: ${session.id}`, { clientId, therapistId: data.therapistId, scheduledAt: data.scheduledAt });
  return session.toJSON() as ISession;
};

/**
 * Get available time slots
 */
export const getAvailableSlots = async (
  therapistId: string,
  date: Date,
  duration: number = 60
): Promise<Array<{ start: Date; end: Date }>> => {
  const therapist = await Therapist.findByPk(therapistId);
  if (!therapist) throw new Error('Therapist not found');

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[date.getDay()];
  const daySchedule = therapist.availability_schedule?.[dayName];
  if (!daySchedule || daySchedule.length === 0) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingBookings = await Session.findAll({
    where: {
      therapist_id: therapistId,
      scheduled_at: { [Op.between]: [startOfDay, endOfDay] },
      status: { [Op.in]: [SessionStatus.SCHEDULED, SessionStatus.IN_PROGRESS] },
    },
  });

  const availableSlots: Array<{ start: Date; end: Date }> = [];
  for (const timeSlot of daySchedule) {
    const [startHour, startMinute] = timeSlot.start.split(':').map(Number);
    const [endHour, endMinute] = timeSlot.end.split(':').map(Number);

    let currentTime = new Date(date);
    currentTime.setHours(startHour, startMinute, 0, 0);
    const slotEnd = new Date(date);
    slotEnd.setHours(endHour, endMinute, 0, 0);

    while (currentTime < slotEnd) {
      const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
      if (slotEndTime > slotEnd) break;

      const hasConflict = existingBookings.some(booking => {
        const bookingStart = new Date(booking.scheduled_at!);
        const bookingEnd = new Date(bookingStart.getTime() + (booking.duration_minutes || 60) * 60000);
        return (
          (currentTime >= bookingStart && currentTime < bookingEnd) ||
          (slotEndTime > bookingStart && slotEndTime <= bookingEnd) ||
          (currentTime <= bookingStart && slotEndTime >= bookingEnd)
        );
      });

      if (!hasConflict && currentTime > new Date()) {
        availableSlots.push({ start: new Date(currentTime), end: new Date(slotEndTime) });
      }
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }
  }
  return availableSlots;
};

/**
 * Get booking by ID
 */
export const getBookingById = async (
  sessionId: string,
  userId: string,
  userRole: string
): Promise<ISession | null> => {
  const where: any = { id: sessionId };
  if (userRole === 'client') where.client_id = userId;
  if (userRole === 'therapist') {
    const therapist = await Therapist.findOne({ where: { user_id: userId } });
    if (therapist) where.therapist_id = therapist.id;
  }

  const session = await Session.findOne({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'first_name', 'last_name', 'email'] },
      { model: Therapist, as: 'therapist', include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }] },
    ],
  });
  return session ? (session.toJSON() as ISession) : null;
};

/**
 * Get user's bookings
 */
export const getUserBookings = async (
  userId: string,
  status?: SessionStatus,
  page: number = 1,
  limit: number = 20
): Promise<{ bookings: ISession[]; total: number }> => {
  const where: any = { client_id: userId };
  if (status) where.status = status;
  const offset = (page - 1) * limit;

  const { rows: sessions, count: total } = await Session.findAndCountAll({
    where,
    include: [{ model: Therapist, as: 'therapist', include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'profile_picture_url'] }] }],
    limit, offset,
    order: [['scheduled_at', 'DESC']],
  });
  return { bookings: sessions.map(s => s.toJSON() as ISession), total };
};

/**
 * Get therapist's bookings
 */
export const getTherapistBookings = async (
  therapistId: string,
  status?: SessionStatus,
  page: number = 1,
  limit: number = 20
): Promise<{ bookings: ISession[]; total: number }> => {
  const where: any = { therapist_id: therapistId };
  if (status) where.status = status;
  const offset = (page - 1) * limit;

  const { rows: sessions, count: total } = await Session.findAndCountAll({
    where,
    include: [{ model: User, as: 'client', attributes: ['id', 'first_name', 'last_name', 'profile_picture_url'] }],
    limit, offset,
    order: [['scheduled_at', 'DESC']],
  });
  return { bookings: sessions.map(s => s.toJSON() as ISession), total };
};

/**
 * Cancel booking
 */
export const cancelBooking = async (
  sessionId: string,
  userId: string,
  reason: string
): Promise<ISession> => {
  const session = await Session.findByPk(sessionId);
  if (!session) throw new Error('Booking not found');
  if (session.status !== SessionStatus.SCHEDULED) throw new Error('Only scheduled bookings can be cancelled');

  const therapist = await Therapist.findOne({ where: { user_id: userId } });
  const canCancel = session.client_id === userId || (therapist && session.therapist_id === therapist.id);
  if (!canCancel) throw new Error('Unauthorized to cancel this booking');

  if (session.scheduled_at) {
    const hoursUntilSession = (new Date(session.scheduled_at).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilSession < 24) logger.warn(`Late cancellation: ${sessionId}`, { hoursUntilSession, userId });
  }

  await session.cancel(reason, userId);
  logger.info(`Booking cancelled: ${sessionId}`, { userId, reason });
  return session.toJSON() as ISession;
};

/**
 * Reschedule booking
 */
export const rescheduleBooking = async (
  sessionId: string,
  userId: string,
  newScheduledAt: Date
): Promise<ISession> => {
  const session = await Session.findByPk(sessionId);
  if (!session) throw new Error('Booking not found');
  if (session.status !== SessionStatus.SCHEDULED) throw new Error('Only scheduled bookings can be rescheduled');

  const therapist = await Therapist.findOne({ where: { user_id: userId } });
  const canReschedule = session.client_id === userId || (therapist && session.therapist_id === therapist.id);
  if (!canReschedule) throw new Error('Unauthorized to reschedule this booking');

  const conflictingSession = await Session.findOne({
    where: {
      therapist_id: session.therapist_id,
      scheduled_at: newScheduledAt,
      status: [SessionStatus.SCHEDULED, SessionStatus.IN_PROGRESS],
      id: { [Op.ne]: sessionId },
    },
  });
  if (conflictingSession) throw new Error('New time slot is not available');

  session.scheduled_at = newScheduledAt;
  await session.save();
  logger.info(`Booking rescheduled: ${sessionId}`, { userId, newScheduledAt });
  return session.toJSON() as ISession;
};

/**
 * Start session
 */
export const startSession = async (sessionId: string): Promise<ISession> => {
  const session = await Session.findByPk(sessionId);
  if (!session) throw new Error('Session not found');
  if (session.status !== SessionStatus.SCHEDULED) throw new Error('Only scheduled sessions can be started');
  await session.start();
  logger.info(`Session started: ${sessionId}`);
  return session.toJSON() as ISession;
};

/**
 * End session
 */
export const endSession = async (sessionId: string): Promise<ISession> => {
  const session = await Session.findByPk(sessionId);
  if (!session) throw new Error('Session not found');
  if (session.status !== SessionStatus.IN_PROGRESS) throw new Error('Only in-progress sessions can be ended');
  await session.end();
  if (session.therapist_id) {
    const therapist = await Therapist.findByPk(session.therapist_id);
    if (therapist) await therapist.incrementSessionCount();
  }
  logger.info(`Session ended: ${sessionId}`, { duration: session.duration_minutes });
  return session.toJSON() as ISession;
};