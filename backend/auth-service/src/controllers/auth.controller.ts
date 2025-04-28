import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { Op } from '@sequelize/core';
import User from '../models/user.model';
import { validateRegisterInput, validateLoginInput } from '../middleware/validation.middleware';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.config';

const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000; // 15 minutes in milliseconds

config();

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, name } = req.body;

        // Validate input
        const validationError = validateRegisterInput(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            name,
            role: 'user'
        } as any);

        // Generate tokens
        const accessToken = generateAccessToken({ id: user.id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost',
            maxAge: ACCESS_TOKEN_EXPIRATION
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost',
            maxAge: REFRESH_TOKEN_EXPIRATION
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
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const verifyToken = async (req: Request, res: Response) => {
    try {
        const accessToken = req.cookies.accessToken;
        
        if (!accessToken) {
            return res.status(401).json({ error: 'No access token provided' });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || 'default-secret-key') as { id: string, role: string };
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (tokenError) {
            // Если access token невалидный, пробуем обновить через refresh token
            const refreshToken = req.cookies.refreshToken;
            
            if (!refreshToken) {
                return res.status(401).json({ error: 'No refresh token provided' });
            }

            try {
                const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'default-secret-key') as { id: string, role: string };
                const user = await User.findByPk(decoded.id);

                if (!user) {
                    return res.status(401).json({ error: 'User not found' });
                }

                // Генерируем новый access token
                const newAccessToken = generateAccessToken({ id: user.id, role: user.role });

                // Устанавливаем новый access token в куки
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    domain: 'localhost',
                    maxAge: ACCESS_TOKEN_EXPIRATION
                });

                res.json({
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                });
            } catch (refreshError) {
                console.error('Refresh token verification failed:', refreshError);
                return res.status(401).json({ error: 'Invalid refresh token' });
            }
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        // Clear all cookies
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost'
        });
        
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost'
        });

        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Validate input
        const validationError = validateLoginInput(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken({ id: user.id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost',
            maxAge: ACCESS_TOKEN_EXPIRATION
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost',
            maxAge: REFRESH_TOKEN_EXPIRATION
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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'default-secret-key') as { id: string, role: string };
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken({ id: user.id, role: user.role });

        // Set new access token cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: 'localhost',
            maxAge: ACCESS_TOKEN_EXPIRATION
        });

        res.json({ message: 'Token refreshed successfully' });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};