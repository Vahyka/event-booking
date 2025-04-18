import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = '24h';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};