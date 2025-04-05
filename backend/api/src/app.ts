import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
// import authRoutes from './routes/authRoutes.ts';
import eventsRoutes from './routes/eventsRoutes.ts';

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

// Middleware 
app.use(express.json());
// Serves the HTML file from the /frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

app.use(cors({
    credentials: true,
}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
})

// Routes
app.use('/events', eventsRoutes);

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on http://localhost:${process.env.PORT}/`);
});