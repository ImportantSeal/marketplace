import { Request, Response } from 'express';
import {
  getAllItems,
  getItemsByOwner,
  createItem,
  updateExistingItem as updateService,
  deleteExistingItem as deleteService,
  getItemByIdService,
} from '../services/item.service';
import { ItemFilterOptions } from '../services/item.service';

export const getItems = async (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;

    const sortParam = typeof sort === 'string' ? sort : 'id_desc';
    const [ sortBy, order ] = sortParam.split('_') as ['id'|'price', 'asc'|'desc'];

    const filters: ItemFilterOptions = {
      search: typeof search === 'string' && search.trim() ? search.trim() : undefined,
      category: typeof category === 'string' && category.trim() ? category.trim() : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy,
      order,
    };

    const items = await getAllItems(filters);
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch items' });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ error: 'Invalid item ID' });
    const item = await getItemByIdService(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch item' });
  }
};

export const getMyItems = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.id as string;
    const items = await getItemsByOwner(ownerId);
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch your items' });
  }
};

export const createNewItem = async (req: Request, res: Response) => {
  try {
    const { name, price, description, category } = req.body;
    const owner_id = (req as any).user.id as string;
    const image = req.file ? `uploads/${req.file.filename}` : '';

    const newItem = await createItem({
      name,
      price,
      description,
      image,
      category,
      owner_id,
    });
    return res.status(201).json(newItem);
  } catch (err: any) {
    if (err.code === '23505')
      return res.status(400).json({ error: 'Duplicate item' });
    console.error(err);
    return res.status(500).json({ error: 'Could not create item' });
  }
};

export const updateExistingItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ error: 'Invalid item ID' });

    const existing = await getItemByIdService(id);
    if (!existing) return res.status(404).json({ error: 'Item not found' });

    const user = (req as any).user;
    if (existing.owner_id !== user.id && !user.admin)
      return res.status(403).json({ error: 'Forbidden' });

    const { name, price, description, category } = req.body;
    const image = req.file
      ? `uploads/${req.file.filename}`
      : existing.image;

    const updated = await updateService(id, {
      name,
      price,
      description,
      image,
      category,
    });
    return res.status(200).json(updated);
  } catch (err: any) {
    if (err.code === '23505')
      return res.status(400).json({ error: 'Duplicate item' });
    console.error(err);
    return res.status(500).json({ error: 'Could not update item' });
  }
};

export const deleteExistingItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ error: 'Invalid item ID' });

    const existing = await getItemByIdService(id);
    if (!existing) return res.status(404).json({ error: 'Item not found' });

    const user = (req as any).user;
    if (existing.owner_id !== user.id && !user.admin)
      return res.status(403).json({ error: 'Forbidden' });

    const deleted = await deleteService(id);
    return res.status(200).json(deleted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not delete item' });
  }
};
