import { Pool } from 'pg';
import { config } from '../config/env';

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT,
});

export interface ItemData {
  name: string;
  price: number;
  description?: string;
  image?: string;
  category: string;
}

export interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  owner_id: string;
  owner_name: string;
  created: Date;
  updated: Date;
}

export interface ItemFilterOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'id' | 'price';
  order?: 'asc' | 'desc';
}

export const getAllItems = async (
  filters: ItemFilterOptions = {}
): Promise<Item[]> => {
  const clauses: string[] = [];
  const values: (string | number)[] = [];
  let idx = 1;

  // Title search
  if (filters.search) {
    clauses.push(`i.name ILIKE $${idx++}`);
    values.push(`%${filters.search}%`);
  }
  // Category filter
  if (filters.category) {
    clauses.push(`i.category = $${idx++}`);
    values.push(filters.category);
  }
  // Min price
  if (filters.minPrice != null) {
    clauses.push(`i.price >= $${idx++}`);
    values.push(filters.minPrice);
  }
  // Max price
  if (filters.maxPrice != null) {
    clauses.push(`i.price <= $${idx++}`);
    values.push(filters.maxPrice);
  }

  let sql = `
    SELECT
      i.id,
      i.name,
      i.price,
      i.description,
      i.image,
      i.category,
      i.owner_id,
      u.name AS owner_name,
      i.created,
      i.updated
    FROM items i
    JOIN users u ON i.owner_id = u.id
  `;

  if (clauses.length) {
    sql += ' WHERE ' + clauses.join(' AND ');
  }

  const sortBy = filters.sortBy === 'price' ? 'i.price' : 'i.id';
  const order = filters.order === 'asc' ? 'ASC' : 'DESC';
  sql += ` ORDER BY ${sortBy} ${order}`;

  const result = await pool.query<Item>(sql, values);
  return result.rows;
};

export const getItemByIdService = async (id: number): Promise<Item | null> => {
  const sql = `
    SELECT
      i.id,
      i.name,
      i.price,
      i.description,
      i.image,
      i.category,
      i.owner_id,
      u.name AS owner_name,
      i.created,
      i.updated
    FROM items i
    JOIN users u ON i.owner_id = u.id
    WHERE i.id = $1
  `;
  const result = await pool.query<Item>(sql, [id]);
  return result.rows[0] || null;
};

export const getItemsByOwner = async (ownerId: string): Promise<Item[]> => {
  const sql = `
    SELECT
      i.id,
      i.name,
      i.price,
      i.description,
      i.image,
      i.category,
      i.owner_id,
      u.name AS owner_name,
      i.created,
      i.updated
    FROM items i
    JOIN users u ON i.owner_id = u.id
    WHERE i.owner_id = $1
    ORDER BY i.created DESC
  `;
  const result = await pool.query<Item>(sql, [ownerId]);
  return result.rows;
};

export const createItem = async (
  data: ItemData & { owner_id: string }
): Promise<Item> => {
  const sql = `
    INSERT INTO items (name, price, description, image, category, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [
    data.name,
    data.price,
    data.description || '',
    data.image || '',
    data.category,
    data.owner_id,
  ];
  const result = await pool.query<Item>(sql, values);
  return result.rows[0];
};

export const updateExistingItem = async (
  id: number,
  data: Partial<ItemData>
): Promise<Item> => {
  const sql = `
    UPDATE items
    SET
      name = $1,
      price = $2,
      description = $3,
      image = $4,
      category = $5,
      updated = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [
    data.name,
    data.price,
    data.description || '',
    data.image || '',
    data.category || '',
    id,
  ];
  const result = await pool.query<Item>(sql, values);
  return result.rows[0];
};

export const deleteExistingItem = async (id: number): Promise<Item> => {
  const sql = `
    DELETE FROM items
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query<Item>(sql, [id]);
  return result.rows[0];
};
