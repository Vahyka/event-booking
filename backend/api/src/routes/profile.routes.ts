import express, { Router, RequestHandler } from 'express';
import { 
    getUserBookings,
    getBookingDetails,
    cancelBooking 
} from '../controllers/booking.controller';
import { authenticate } from '../../../auth-service/src/middleware/auth.middleware';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate as RequestHandler);

// Get user's bookings
router.get('/bookings', getUserBookings as RequestHandler);

// Get specific booking details
router.get('/bookings/:id', getBookingDetails as RequestHandler);

// Cancel a booking
router.put('/bookings/:id/cancel', cancelBooking as RequestHandler);

export default router; 