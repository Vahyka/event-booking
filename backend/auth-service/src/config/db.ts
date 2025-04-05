import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import dotenv from 'dotenv'

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  host: process.env.DB_HOST || 'auth-db',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'auth_db',
});

export default sequelize;