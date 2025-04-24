"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("../controllers/booking.controller");
// import { authenticate } from '../middleware/auth.middleware';
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// Get user's bookings
router.get('/bookings', booking_controller_1.getUserBookings);
// Get specific booking details
router.get('/bookings/:id', booking_controller_1.getBookingDetails);
// Cancel a booking
router.put('/bookings/:id/cancel', booking_controller_1.cancelBooking);
exports.default = router;
