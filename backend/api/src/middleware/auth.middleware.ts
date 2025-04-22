import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/verify-token`,
      {},
      {
        headers: { Authorization: token }
      }
    );

    // Добавляем информацию о пользователе в request
    req.user = response.data.user;
    next();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res.status(401).json({ message: error.response?.data?.message || 'Authentication failed' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.email || '')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};