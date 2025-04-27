import express, { Router, RequestHandler } from 'express';
import { 
    getUserBookings,
    getBookingDetails,
    cancelBooking 
} from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.use(authenticate as unknown as RequestHandler);

router.get('/bookings', getUserBookings as unknown as RequestHandler);

router.get('/bookings/:id', getBookingDetails as unknown as RequestHandler);

router.put('/bookings/:id/cancel', cancelBooking as unknown as RequestHandler);

export default router; 