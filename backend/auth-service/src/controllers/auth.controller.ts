import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { Op } from '@sequelize/core';
import User from '../models/user.model';
import { validateRegisterInput, validateLoginInput } from '../middleware/validation.middleware';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.config';
import cors from 'cors';

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

// Шаг 1: Первоначальный запрос и верификация
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Валидация входных данных
        const validationError = validateLoginInput(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        // Поиск пользователя
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Шаг 2: Верификация полномочий
        const userPermissions = await getUserPermissions(user.id);

        // Шаг 3: Генерация токенов
        const accessToken = generateAccessToken({ 
            id: user.id, 
            role: user.role,
            permissions: userPermissions 
        });
        const refreshToken = generateRefreshToken({ 
            id: user.id, 
            role: user.role 
        });

        // Шаг 4: Сохранение токенов в куки
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

        // Отправка ответа с данными пользователя
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
                permissions: userPermissions
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Функция для получения разрешений пользователя
async function getUserPermissions(userId: string): Promise<string[]> {
    // Здесь можно реализовать логику получения разрешений из базы данных
    // Пока возвращаем базовые разрешения в зависимости от роли
    const user = await User.findByPk(userId);
    if (!user) return [];
    
    return user.role === 'admin' 
        ? ['read', 'write', 'delete', 'admin']
        : ['read', 'write'];
}

// Проверка токена и обновление при необходимости
export const verifyToken = async (req: Request, res: Response) => {
    try {
        const accessToken = req.cookies.accessToken;
        
        if (!accessToken) {
            return res.status(401).json({ error: 'No access token provided' });
        }

        try {
            // Проверка access token
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || 'default-secret-key') as { 
                id: string;
                role: string;
                permissions: string[];
            };

            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Получение актуальных разрешений
            const currentPermissions = await getUserPermissions(user.id);

            return res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    permissions: currentPermissions
                }
            });
        } catch (tokenError) {
            // Если access token невалидный, пробуем обновить через refresh token
            const refreshToken = req.cookies.refreshToken;
            
            if (!refreshToken) {
                return res.status(401).json({ error: 'No refresh token provided' });
            }

            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'default-secret-key') as { 
                id: string;
                role: string;
            };

            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Получение актуальных разрешений
            const currentPermissions = await getUserPermissions(user.id);

            // Генерация нового access token с актуальными разрешениями
            const newAccessToken = generateAccessToken({ 
                id: user.id, 
                role: user.role,
                permissions: currentPermissions
            });

            // Установка нового access token
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                domain: 'localhost',
                maxAge: ACCESS_TOKEN_EXPIRATION
            });

            return res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    permissions: currentPermissions
                }
            });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Выход из системы
export const logout = async (req: Request, res: Response) => {
    try {
        // Очистка токенов
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