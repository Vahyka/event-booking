import express, { Router, RequestHandler } from 'express';
import { 
    createEvent, 
    getEvents, 
    getEventById, 
    updateEvent, 
    deleteEvent 
} from '../controllers/event.controller';
import { authenticate, authorize } from '../../../auth-service/src/middleware/auth.middleware';

const router: Router = express.Router();

// Public routes
router.get('/', getEvents as RequestHandler);
router.get('/:id', getEventById as RequestHandler);

// Protected routes (admin only)
// router.post('/', authenticate, authorize(['admin']), createEvent as RequestHandler);
// router.put('/:id', authenticate, authorize(['admin']), updateEvent as RequestHandler);
// router.delete('/:id', authenticate, authorize(['admin']), deleteEvent as RequestHandler);

export default router; 