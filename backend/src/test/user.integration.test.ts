import request from 'supertest';
import app from '../app';
import { Pool } from 'pg';

describe('User API Integration Tests', () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      password: process.env.DB_PASSWORD || 'diner_password',
      database: process.env.DB_NAME || 'react_diner',
      port: Number(process.env.DB_PORT) || 5432,
    });
  });

  beforeEach(async () => {
    // tyhjennä users-taulu ennen jokaista testiä
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should sign up a new user', async () => {
    const res = await request(app).post('/api/users/signup').send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123"
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe("testuser@example.com");
  });

  it('should not allow duplicate email registration', async () => {
    // Rekisteröidään sama sähköposti kahdesti
    const first = await request(app).post('/api/users/signup').send({
      name: "Duplicate",
      email: "duplicate@example.com",
      password: "dup123"
    });
    expect(first.status).toBe(201);

    const second = await request(app).post('/api/users/signup').send({
      name: "Duplicate2",
      email: "duplicate@example.com",
      password: "dup456"
    });
    expect(second.status).toBe(400);
    expect(second.body.error).toBe('Email already exists');
  });

  it('should log in an existing user', async () => {
    // Luodaan ensin käyttäjä
    await request(app).post('/api/users/signup').send({
      name: "Login User",
      email: "loginuser@example.com",
      password: "password123"
    });
    // Kirjaudutaan sisään
    const res = await request(app).post('/api/users/login').send({
      email: "loginuser@example.com",
      password: "password123"
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject login with incorrect password', async () => {
    // Luodaan ensin käyttäjä
    await request(app).post('/api/users/signup').send({
      name: "Wrong Password User",
      email: "wrongpass@example.com",
      password: "realpassword"
    });
    // Yritetään kirjautua väärällä salasanalla
    const res = await request(app).post('/api/users/login').send({
      email: "wrongpass@example.com",
      password: "incorrect"
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid password');
  });

  it('should prevent unauthorized access to protected routes (e.g. creating an item)', async () => {
    // Yritetään POST /api/items ilman tokenia
    const res = await request(app).post('/api/items').send({
      name: 'Unauthorized Item',
      price: 10.99
    });
    // verifyToken-middleware estää tämän
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No token provided');
  });
});
