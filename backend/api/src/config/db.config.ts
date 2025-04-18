import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { config } from 'dotenv';

config();

// Validate required environment variables
const requiredEnvVars = ['API_DB_HOST', 'API_DB_PORT', 'API_DB_USER', 'API_DB_PASSWORD', 'API_DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  host: process.env.API_DB_HOST,
  port: Number(process.env.API_DB_PORT),
  user: process.env.API_DB_USER,
  password: process.env.API_DB_PASSWORD,
  database: process.env.API_DB_NAME,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('API Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the API database:', error);
    throw error;
  }
};

export default sequelize; 