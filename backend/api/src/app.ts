import express from 'express';
// import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import eventRouter from './routes/events.routes'
import morgan from 'morgan';
import helmet from 'helmet';
import profileRoutes from './routes/profile.routes';
import { testConnection } from './config/db.config';


const app = express();
dotenv.config();

// Middleware 
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));

app.use(morgan('dev'));
app.use(helmet());

app.use('/api/events', eventRouter);
app.use('/api/profile', profileRoutes);
// app.use('/api/orders', bookingRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT;

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
