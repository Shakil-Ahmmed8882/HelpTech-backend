import { z } from 'zod';

export const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string()).nonempty("tags are required"),
    category: z.string().min(1, 'Category is required'),
    author: z.string().nonempty("author id required"),
  }),
});

export const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(), 
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    author: z.string().optional(),
  }),
});

export const PostValidations = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
