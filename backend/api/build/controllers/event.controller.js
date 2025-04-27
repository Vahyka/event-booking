"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
const uuid_1 = require("uuid");
const event_model_1 = __importDefault(require("../models/event.model"));
const core_1 = require("@sequelize/core");
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, image } = req.body;
        const event = await event_model_1.default.create({
            id: (0, uuid_1.v4)(),
            title,
            description,
            date,
            location,
            image
        });
        res.status(201).json(event);
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
};
exports.createEvent = createEvent;
const getEvents = async (req, res) => {
    try {
        const { search, date } = req.query;
        const where = {};
        if (search) {
            where[core_1.Op.or] = [
                { title: { [core_1.Op.iLike]: `%${search}%` } },
                { description: { [core_1.Op.iLike]: `%${search}%` } },
                { location: { [core_1.Op.iLike]: `%${search}%` } }
            ];
        }
        if (date) {
            where.date = {
                [core_1.Op.gte]: new Date(date)
            };
        }
        const events = await event_model_1.default.findAll({
            where,
            order: [['date', 'ASC']]
        });
        res.json(events);
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await event_model_1.default.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
};
exports.getEventById = getEventById;
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, image } = req.body;
        const event = await event_model_1.default.findByPk(id);
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
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await event_model_1.default.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        await event.destroy();
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
};
exports.deleteEvent = deleteEvent;
