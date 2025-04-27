"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingDetails = exports.cancelBooking = exports.getUserBookings = exports.createBooking = void 0;
const booking_model_1 = __importDefault(require("../models/booking.model"));
const seat_model_1 = __importDefault(require("../models/seat.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const createBooking = async (req, res) => {
    try {
        const { eventId, seatId } = req.body;
        const userId = req.user?.id; // Assuming user ID is available from auth middleware
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Check if seat is available
        const seat = await seat_model_1.default.findByPk(seatId);
        if (!seat || seat.status !== 'available') {
            return res.status(400).json({ error: 'Seat is not available' });
        }
        // Check if event exists
        const event = await event_model_1.default.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        // Create booking
        const booking = await booking_model_1.default.create({
            eventId,
            seatId,
            userId,
            status: 'confirmed'
        });
        // Update seat status
        await seat.update({ status: 'booked' });
        res.status(201).json(booking);
    }
    catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};
exports.createBooking = createBooking;
const getUserBookings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const bookings = await booking_model_1.default.findAll({
            where: { userId },
            include: [
                {
                    model: event_model_1.default,
                    attributes: ['title', 'date', 'location']
                },
                {
                    model: seat_model_1.default,
                    attributes: ['seatNumber']
                }
            ],
            order: [['bookingDate', 'DESC']]
        });
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};
exports.getUserBookings = getUserBookings;
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const booking = await booking_model_1.default.findOne({
            where: { id, userId }
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        // Update booking status
        await booking.update({ status: 'cancelled' });
        // Update seat status
        const seat = await seat_model_1.default.findByPk(booking.seatId);
        if (seat) {
            await seat.update({ status: 'available' });
        }
        res.json(booking);
    }
    catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};
exports.cancelBooking = cancelBooking;
const getBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const booking = await booking_model_1.default.findOne({
            where: { id, userId },
            include: [
                {
                    model: event_model_1.default,
                    attributes: ['title', 'date', 'location']
                },
                {
                    model: seat_model_1.default,
                    attributes: ['seatNumber']
                }
            ]
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    }
    catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ error: 'Failed to fetch booking details' });
    }
};
exports.getBookingDetails = getBookingDetails;
