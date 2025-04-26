import { Request, Response } from 'express';
import Booking from '../models/booking.model';
import Seat from '../models/seat.model';
import Event from '../models/event.model';
import { v4 as uuidv4 } from 'uuid';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { eventId, seatId, userId } = req.body;

        // Валидация UUID
        const isValidUUID = (str: string) => {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(str);
        };

        // Проверяем, что все ID являются валидными UUID
        if (!isValidUUID(eventId) || !isValidUUID(userId)) {
            return res.status(400).json({ 
                message: 'Invalid ID format. All IDs must be valid UUIDs' 
            });
        }

        // Проверяем существование события
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Проверяем существование места
        const seat = await Seat.findOne({
            where: {
                seatNumber: seatId,
                eventId: eventId
            }
        });
        
        if (!seat) {
            return res.status(404).json({ message: 'Seat not found or does not belong to this event' });
        }

        // Проверяем, не забронировано ли уже место
        const existingBooking = await Booking.findOne({
            where: {
                eventId,
                seatId: seat.id,
            }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'This seat is already booked' });
        }

        // Создаем бронь
        const booking = await Booking.create({
            id: uuidv4(),
            userId,
            eventId,
            seatId: seat.id,
        });

        // Обновляем статус места
        await seat.update({ status: 'booked' });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking' });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.findAll({
            where: { userId },
            include: [
                {
                    model: Event,
                    attributes: ['title', 'date', 'location']
                },
                {
                    model: Seat,
                    attributes: ['seatNumber', 'status']
                }
            ]
        });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // booking.status = 'cancelled';
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking' });
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