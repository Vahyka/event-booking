import express from 'express';

const router = express.Router();

// Show up the list of events
router.get('/', (req, res) => {
    res.status(202).send("Fetching events!");
});
// Request to buy a ticket
router.post('/', (req, res) => {
    res.send('Saving events!');
});

export default router;