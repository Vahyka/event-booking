import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from '@sequelize/core';
import User from '../models/user.model';
import { validateRegisterInput, validateLoginInput } from '../middleware/validation.middleware';
import { generateToken } from '../config/jwt.config';
import cors from 'cors';

const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
        } as any); // Type assertion needed due to Sequelize type limitations

        // Generate JWT token
        const token = generateToken({ id: user.id, role: user.role });

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
    } catch (error) {
        console.error('Registration error:', error);
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

        // Generate JWT token
        const token = generateToken({ id: user.id, role: user.role });

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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 