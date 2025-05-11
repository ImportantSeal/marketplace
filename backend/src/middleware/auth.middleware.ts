import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Invalid token format" });
    return;
  }
  try {
    const decoded = jwt.verify(token, config.JWT_KEY);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};