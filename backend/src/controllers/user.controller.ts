import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/env';
import { createUser, findUserByEmail } from '../services/user.service';
import db from '../db/db';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, hashed_password: hashedPassword });
    res.status(201).json(user);
    return;
  } catch (error: any) {
    if (error.code === '23505') { 
      res.status(400).json({ error: 'Email already exists' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Could not create user' });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Missing email or password' });
      return;
    }
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, admin: user.admin, name: user.name },
      config.JWT_KEY,
      { expiresIn: '1h' }
    );
    res.status(200).json({ id: user.id, token, name: user.name });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not log in' });
    return;
  }
};


export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query('SELECT id, name, email FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch users' });
  }
};


