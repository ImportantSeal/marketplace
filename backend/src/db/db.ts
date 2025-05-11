import { Pool } from 'pg';
import { config } from '../config/env';

console.log(`Connecting to database: ${config.DB_NAME} on ${config.DB_HOST}`);

export const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT,
});

export default pool;