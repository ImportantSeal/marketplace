import { Router } from 'express';
import { signup, login, getUsers } from '../controllers/user.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', getUsers); 

export default router;
