"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeatStatus = exports.getAvailableSeats = exports.getEventSeats = void 0;
const seat_model_1 = __importDefault(require("../models/seat.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
// import { Op } from '@sequelize/core';
const getEventSeats = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { status } = req.query;
        const where = { eventId };
        if (status) {
            where.status = status;
        }
        const seats = await seat_model_1.default.findAll({
            where,
            include: [{
                    model: event_model_1.default,
                    attributes: ['title', 'date', 'location']
                }],
            order: [['seatNumber', 'ASC']]
        });
        res.json(seats);
    }
    catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).json({ error: 'Failed to fetch seats' });
    }
};
exports.getEventSeats = getEventSeats;
const getAvailableSeats = async (req, res) => {
    try {
        const { eventId } = req.params;
        const seats = await seat_model_1.default.findAll({
            where: {
                eventId,
                status: 'available'
            },
            include: [{
                    model: event_model_1.default,
                    attributes: ['title', 'date', 'location']
                }],
            order: [['seatNumber', 'ASC']]
        });
        res.json(seats);
    }
    catch (error) {
        console.error('Error fetching available seats:', error);
        res.status(500).json({ error: 'Failed to fetch available seats' });
    }
};
exports.getAvailableSeats = getAvailableSeats;
const updateSeatStatus = async (req, res) => {
    try {
        const { seatId } = req.params;
        const { status } = req.body;
        if (!['available', 'booked'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const seat = await seat_model_1.default.findByPk(seatId);
        if (!seat) {
            return res.status(404).json({ error: 'Seat not found' });
        }
        await seat.update({ status });
        res.json(seat);
    }
    catch (error) {
        console.error('Error updating seat status:', error);
        res.status(500).json({ error: 'Failed to update seat status' });
    }
};
exports.updateSeatStatus = updateSeatStatus;
