import { Router, RequestHandler } from 'express';
import { createBooking, getUserBookings, cancelBooking } from '../controllers/booking.controller';

const router = Router();

router.post('/create', createBooking as RequestHandler);
router.get('/user/:userId', getUserBookings as RequestHandler);
router.put('/:bookingId/cancel', cancelBooking as RequestHandler);

export default router; 