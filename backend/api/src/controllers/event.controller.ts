import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Event from '../models/event.model';
import Seat from '../models/seat.model';
import { Op } from '@sequelize/core';

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, description, date, location, image } = req.body;
        
        const event = await Event.create({
            id: uuidv4(),
            title,
            description,
            date,
            location,
            image
        });

        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
};

export const getEvents = async (req: Request, res: Response) => {
    try {
        const { search, date } = req.query;
        
        const where: any = {};
        
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { location: { [Op.iLike]: `%${search}%` } }
            ];
        }
        
        if (date) {
            where.date = {
                [Op.gte]: new Date(date as string)
            };
        }

        const events = await Event.findAll({
            where,
            order: [['date', 'ASC']]
        });

        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const event = await Event.findByPk(id);
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, image } = req.body;
        
        const event = await Event.findByPk(id);
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await event.update({
            title,
            description,
            date,
            location,
            image
        });

        res.json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const event = await Event.findByPk(id);
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await event.destroy();
        
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
}; 

