import express, { Router, RequestHandler } from 'express';
import { register, login, verifyToken, logout, refreshToken } from '../controllers/auth.controller';

const router: Router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/verify-token', verifyToken as RequestHandler);
router.post('/refresh-token', refreshToken as RequestHandler);
router.post('/logout', logout as RequestHandler);
router.post('/login', login as RequestHandler);

export default router;