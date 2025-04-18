import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import sequelize from './config/db.config';
import authRoute from './routes/auth.routes';
// import { errorHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/auth', authRoute);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// app.use(errorHandler);

const PORT = process.env.PORT;

async function initializeApp() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Auth service is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

initializeApp();

export default app;
