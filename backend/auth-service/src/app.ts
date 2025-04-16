import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db';

const app = express();
dotenv.config();

// Middleware 
app.use(express.json());

app.use(cors({
    credentials: true,
}))

// Routes
// app.use('/auth', authRoutes);

async function initializeApp() {
  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }

  app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}/`);
  });
}

initializeApp();
