"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../controllers/event.controller");
const router = express_1.default.Router();
// Public routes
router.get('/', event_controller_1.getEvents);
router.get('/:id', event_controller_1.getEventById);
// Protected routes (admin only)
router.post('/', event_controller_1.createEvent);
// router.put('/:id', authenticate, authorize(['admin']), updateEvent as RequestHandler);
// router.delete('/:id', authenticate, authorize(['admin']), deleteEvent as RequestHandler);
exports.default = router;
