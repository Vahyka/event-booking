import { Request, Response } from 'express';
import Seat from '../models/seat.model';
import Event from '../models/event.model';
import { Op } from '@sequelize/core';

export const getEventSeats = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { status } = req.query;

        const where: any = { eventId };
        
        if (status) {
            where.status = status;
        }

        const seats = await Seat.findAll({
            where,
            include: [{
                model: Event,
                attributes: ['title', 'date', 'location']
            }],
            order: [['seatNumber', 'ASC']]
        });

        res.json(seats);
    } catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).json({ error: 'Failed to fetch seats' });
    }
};

export const getAvailableSeats = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;

        const seats = await Seat.findAll({
            where: {
                eventId,
                status: 'available'
            },
            include: [{
                model: Event,
                attributes: ['title', 'date', 'location']
            }],
            order: [['seatNumber', 'ASC']]
        });

        res.json(seats);
    } catch (error) {
        console.error('Error fetching available seats:', error);
        res.status(500).json({ error: 'Failed to fetch available seats' });
    }
};

export const updateSeatStatus = async (req: Request, res: Response) => {
    try {
        const { seatId } = req.params;
        const { status } = req.body;

        if (!['available', 'booked'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const seat = await Seat.findByPk(seatId);
        
        if (!seat) {
            return res.status(404).json({ error: 'Seat not found' });
        }

        await seat.update({ status });

        res.json(seat);
    } catch (error) {
        console.error('Error updating seat status:', error);
        res.status(500).json({ error: 'Failed to update seat status' });
    }
}; 