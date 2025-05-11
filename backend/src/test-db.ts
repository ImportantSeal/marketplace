import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env.test' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  password: process.env.DB_PASSWORD || 'diner_password',
  database: process.env.DB_NAME || 'diner_test_db',
  port: Number(process.env.DB_PORT) || 5432,
});

const testDb = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', res.rows);
  } catch (error) {
    console.error(' Database connection failed:', error);
  }
};

testDb();
