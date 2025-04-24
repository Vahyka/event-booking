"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const axios_1 = __importDefault(require("axios"));
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const response = await axios_1.default.post(`${AUTH_SERVICE_URL}/auth/verify-token`, {}, {
            headers: { Authorization: token }
        });
        // Добавляем информацию о пользователе в request
        req.user = response.data.user;
        next();
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            return res.status(401).json({ message: error.response?.data?.message || 'Authentication failed' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.email || '')) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
exports.authorize = authorize;
