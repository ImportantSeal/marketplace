import { z } from 'zod';

export const categories = [
  'Sports & Outdoors',
  'Clothing & Accessories',
  'Other',
  'Electronics',
  'Tools & Home Improvement',
  'Industrial & Scientific',
  'Automotive',
  'Furniture',
  'Home & Kitchen',
  'Pet Supplies',
  'Other'
] as const;
export const categorySchema = z.enum(categories, {
  errorMap: () => ({ message: 'Invalid category selected' }),
});

export const itemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  price: z.number().min(0, 'Price must be a positive number'),
  description: z.string().optional(),
  image: z.string().optional(),
  category: categorySchema,
});

export const updateItemSchema = itemSchema.partial();
