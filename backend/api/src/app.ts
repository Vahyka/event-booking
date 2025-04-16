import express from 'express';
// import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import eventRouter from './routes/eventsRoutes'


const app = express();
dotenv.config();

// Middleware 
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",  // Или process.env.FRONTEND_URL
    credentials: true,
}));

app.use('/api/events', eventRouter);

app.get('/ping', (req, res) => {
    console.log('someone pinged here!');
    // req.get('/');
    res.send('pong');
});

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on http://localhost:${process.env.PORT}/`);
});
