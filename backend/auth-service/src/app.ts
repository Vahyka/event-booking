import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import db from './config/db.ts';
// import authRoutes from './routes/authRoutes.ts';

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

// Middleware 
app.use(express.json());

app.use(cors({
    credentials: true,
}))

// Routes
// app.use('/auth', authRoutes);

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on http://localhost:${process.env.PORT}/`);
});
