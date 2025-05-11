import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/users';
import itemRoutes from './routes/items';
import categoryRoutes from './routes/categories';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost',
    'http://10.120.0.6',
    'http://172.16.7.128',
    'http://172.16.7.128:80'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (_req, res) => {
  res.send('Marketplace API is running...');
});

export default app;
