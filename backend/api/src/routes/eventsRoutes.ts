import express from 'express';
// import db from '../db.ts'

const router = express.Router();

// Show up the list of events
router.get('/', (req, res) => {
    res.status(202).send("get events!");
});
// Request to buy a ticket
router.post('/', (req, res) => {});

export default router;