import request from 'supertest';
import app from '../app';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

describe('Items API', () => {
  let pool: Pool;

  // Perus token tavalliselle test-käyttäjälle
  const userToken = jwt.sign({ user: 'test', admin: false }, config.JWT_KEY, { expiresIn: '1h' });
  // Admin-käyttäjän token
  const adminToken = jwt.sign({ user: 'adminUser', admin: true }, config.JWT_KEY, { expiresIn: '1h' });

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
    await pool.query('TRUNCATE TABLE items RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should return 200', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
  });

  it('should return 200 and valid JSON', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 200 and json if found', async () => {
    const created = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Test GET', price: 9.99 });
    const res = await request(app).get(`/api/items/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
  });

  it('should return 404 and Not Found', async () => {
    const res = await request(app).get('/api/items/999999');
    expect(res.status).toBe(404);
  });

  it('should return 400 if id is invalid (e.g. "abc")', async () => {
    const res = await request(app).get('/api/items/abc');
    expect(res.status).toBe(400);
  });

  it('should create a new item', async () => {
    const newItem = { name: 'Margherita Pizza', price: 12.5 };
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newItem);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Margherita Pizza');
  });

  it('should not allow missing name property', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 10.0 });
    expect(res.status).toBe(400);
  });

  it('should not allow missing price property', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Missing Price' });
    expect(res.status).toBe(400);
  });

  it('should not allow empty name', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: '', price: 10 });
    expect(res.status).toBe(400);
  });

  it('should not allow zero or negative price', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'ZeroPrice', price: 0 });
    expect(res.status).toBe(400);
  });

  it('should not allow too short name', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'A', price: 9 });
    expect(res.status).toBe(400);
  });

  it('should not allow a duplicate item', async () => {
    const item = { name: 'Duplicate Item', price: 5.99 };
    const first = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send(item);
    expect(first.status).toBe(201);

    const duplicate = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send(item);
    expect(duplicate.status).toBe(400);
  });

  it('should delete the item by id', async () => {
    const created = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'To be deleted', price: 5.99 });
    const del = await request(app)
      .delete(`/api/items/${created.body.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(del.status).toBe(200);
    expect(del.body.name).toBe('To be deleted');
  });

  it('should return 404 if item with id does not exist', async () => {
    const res = await request(app)
      .delete('/api/items/999999')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
  });


});
