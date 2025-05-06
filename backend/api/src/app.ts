import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import eventRouter from './routes/events.routes'
import morgan from 'morgan';
import helmet from 'helmet';
import { testConnection} from './config/db.config';
import bookingRouter from './routes/booking.routes';
import sequelize from './config/db.config';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './config/swagger_output.json';

const app = express();
dotenv.config();

// Middleware 
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(morgan('dev'));
app.use(helmet());

app.use('/api/events', eventRouter);
app.use('/api/bookings', bookingRouter);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

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
        // Sync all models with database
        await sequelize.sync({ alter: true });
        console.log('Database tables synchronized');
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
