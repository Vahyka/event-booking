"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import db from '../db.ts'
const router = express_1.default.Router();
// Show up the list of events
router.get('/', (req, res) => {
    res.status(202).send("Fetching events!");
});
// Request to buy a ticket
router.post('/', (req, res) => {
    res.send('Saving events!');
});
exports.default = router;
