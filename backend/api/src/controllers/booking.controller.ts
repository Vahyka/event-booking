import { Request, response, Response } from 'express';
import Booking from '../models/booking.model';
import Seat from '../models/seat.model';
import Event from '../models/event.model';
import { Op } from '@sequelize/core';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { eventId, seatId } = req.body;
        const userId = req.user?.id; // Assuming user ID is available from auth middleware

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if seat is available
        const seat = await Seat.findByPk(seatId);
        if (!seat || seat.status !== 'available') {
            return res.status(400).json({ error: 'Seat is not available' });
        }

        // Check if event exists
        const event = await Event.findByPk(eventId);
        if (!event) 
        {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Create booking
        const booking = await Booking.create({
            eventId,
            seatId,
            userId,
            status: 'confirmed'
        } as any);

        // Update seat status
        await seat.update({ status: 'booked' });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const bookings = await Booking.findAll({
            where: { userId },
            include: [
                {
                    model: Event,
                    attributes: ['title', 'date', 'location']
                },
                {
                    model: Seat,
                    attributes: ['seatNumber']
                }
            ],
            order: [['bookingDate', 'DESC']]
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const booking = await Booking.findOne({
            where: { id, userId }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Update booking status
        await booking.update({ status: 'cancelled' });

        // Update seat status
        const seat = await Seat.findByPk(booking.seatId);
        if (seat) {
            await seat.update({ status: 'available' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};

export const getBookingDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const booking = await Booking.findOne({
            where: { id, userId },
            include: [
                {
                    model: Event,
                    attributes: ['title', 'date', 'location']
                },
                {
                    model: Seat,
                    attributes: ['seatNumber']
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ error: 'Failed to fetch booking details' });
    }
}; 