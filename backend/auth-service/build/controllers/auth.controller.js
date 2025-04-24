"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.logout = exports.verifyToken = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const core_1 = require("@sequelize/core");
const user_model_1 = __importDefault(require("../models/user.model"));
const validation_middleware_1 = require("../middleware/validation.middleware");
const jwt_config_1 = require("../config/jwt.config");
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
(0, dotenv_1.config)();
const register = async (req, res) => {
    try {
        const { username, email, password, name } = req.body;
        // Validate input
        const validationError = (0, validation_middleware_1.validateRegisterInput)(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({
            where: {
                [core_1.Op.or]: [{ email }, { username }]
            }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = await user_model_1.default.create({
            username,
            email,
            password: hashedPassword,
            name,
            role: 'user'
        }); // Type assertion needed due to Sequelize type limitations
        // Generate JWT token
        const token = (0, jwt_config_1.generateToken)({ id: user.id, role: user.role });
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost',
            maxAge: TOKEN_EXPIRATION
        });
        // Set session cookie
        res.cookie('session-cookie', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost',
            maxAge: TOKEN_EXPIRATION
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.register = register;
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await user_model_1.default.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        return res.json({ user: { id: user.id, email: user.email } });
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.verifyToken = verifyToken;
const logout = async (req, res) => {
    try {
        // Clear all cookies
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost'
        });
        res.clearCookie('session-cookie', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost'
        });
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.logout = logout;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validate input
        const validationError = (0, validation_middleware_1.validateLoginInput)(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        // Find user by username
        const user = await user_model_1.default.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = (0, jwt_config_1.generateToken)({ id: user.id, role: user.role });
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost',
            maxAge: TOKEN_EXPIRATION
        });
        // Set session cookie
        res.cookie('session-cookie', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost',
            maxAge: TOKEN_EXPIRATION
        });
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
