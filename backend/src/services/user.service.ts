import { Pool } from 'pg';
import { config } from '../config/env';

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT,
});

export interface User {
  id: string;
  name: string;
  email: string;
  hashed_password: string;
  admin: boolean;
  created: Date;
  updated: Date;
}

export const createUser = async (data: { name: string; email: string; hashed_password: string; }) => {
  const query = `
    INSERT INTO users (name, email, hashed_password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [data.name, data.email, data.hashed_password];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};
