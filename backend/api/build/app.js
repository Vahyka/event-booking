"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import http from 'http';
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const events_routes_1 = __importDefault(require("./routes/events.routes"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const db_config_1 = require("./config/db.config");
const app = (0, express_1.default)();
dotenv_1.default.config();
// Middleware 
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
app.use('/api/events', events_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
// app.use('/api/orders', bookingRouter);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Start server
const PORT = process.env.PORT;
app.listen(PORT, async () => {
    try {
        await (0, db_config_1.testConnection)();
        console.log(`Server is running on port ${PORT}`);
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
