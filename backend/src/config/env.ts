import dotenv from 'dotenv';
dotenv.config();

interface Config {
  PORT: number;
  DB_USER: string;
  DB_HOST: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: number;
  JWT_KEY: string;
}

export const config: Config = {
  PORT: Number(process.env.PORT) || 5000,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_HOST: process.env.DB_HOST || 'db',
  DB_PASSWORD: process.env.DB_PASSWORD || 'marketplace_password',
  DB_NAME: process.env.DB_NAME || 'marketplace_db',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  JWT_KEY: process.env.JWT_KEY || 'default_marketplace_jwt_key',
};
