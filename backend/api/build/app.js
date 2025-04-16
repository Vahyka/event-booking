"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import http from 'http';
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
// Middleware 
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // Или process.env.FRONTEND_URL
    credentials: true,
}));
app.get('/ping', (req, res) => {
    console.log('someone pinged here!');
    // req.get('/');
    res.send('pong');
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}/`);
});
