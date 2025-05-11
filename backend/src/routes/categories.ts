import { Router } from 'express';
import { categories } from '../validations/item.validation';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json(categories);
});

export default router;
