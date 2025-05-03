import express, { Router, RequestHandler } from 'express';
import { 
    getEvents, 
    getEventById,
    createEvent,
} from '../controllers/event.controller';
import { getEventSeats } from '../controllers/seat.controller';

const router: Router = express.Router();

// Public routes
router.get('/', getEvents as RequestHandler);
router.get('/:id', getEventById as RequestHandler);
router.get('/:id/seats', getEventSeats as RequestHandler);
// Protected routes (admin only)
router.post('/create', createEvent as RequestHandler);
// router.put('/:id', authenticate, authorize(['admin']), updateEvent as RequestHandler);
// router.delete('/:id', authenticate, authorize(['admin']), deleteEvent as RequestHandler);

export default router; 