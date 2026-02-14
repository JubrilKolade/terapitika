import { Router } from 'express';
import * as BookingController from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { sanitizeBody, validatePaginationParams } from '../middlewares/validation.middleware';

const router = Router();

// All booking routes require authentication
router.post('/', authenticate, sanitizeBody, BookingController.createBooking);
router.get('/available-slots', BookingController.getAvailableSlots);
router.get('/my-bookings', authenticate, validatePaginationParams, BookingController.getUserBookings);
router.get('/:id', authenticate, BookingController.getBookingById);
router.post('/:id/cancel', authenticate, sanitizeBody, BookingController.cancelBooking);
router.post('/:id/reschedule', authenticate, sanitizeBody, BookingController.rescheduleBooking);
router.post('/:id/start', authenticate, BookingController.startSession);
router.post('/:id/end', authenticate, BookingController.endSession);

export default router;
