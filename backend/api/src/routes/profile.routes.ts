import express, { Router, RequestHandler } from 'express';
import { 
    getUserBookings,
    getBookingDetails,
    cancelBooking 
} from '../controllers/booking.controller';
// import { authenticate } from '../middleware/auth.middleware';
import { authenticate } from '../../src/middleware/auth.middleware';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate as unknown as RequestHandler);

// Get user's bookings
router.get('/bookings', getUserBookings as unknown as RequestHandler);

// Get specific booking details
router.get('/bookings/:id', getBookingDetails as unknown as RequestHandler);

// Cancel a booking
router.put('/bookings/:id/cancel', cancelBooking as unknown as RequestHandler);

export default router; 