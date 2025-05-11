import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.middleware';
import {
  getItems,
  getItemById,
  getMyItems,
  createNewItem,
  updateExistingItem,
  deleteExistingItem,
} from '../controllers/item.controller';

const asyncHandler = (fn: any) => (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> =>
  Promise.resolve(fn(req, res, next)).catch(next);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/'),
    filename: (_req, file, cb) => cb(null, file.originalname),
  }),
});

const router: Router = Router();

router.get('/my', verifyToken, asyncHandler(getMyItems));
router.get('/', asyncHandler(getItems));
router.get('/:id', asyncHandler(getItemById));

router.post(
  '/',
  verifyToken,
  upload.single('image'),
  asyncHandler(createNewItem)
);
router.put(
  '/:id',
  verifyToken,
  upload.single('image'),
  asyncHandler(updateExistingItem)
);

router.delete('/:id', verifyToken, asyncHandler(deleteExistingItem));

export default router;
