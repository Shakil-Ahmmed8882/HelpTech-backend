import { z } from 'zod';

export const createCommentValidationSchema = z.object({
  post: z.string().nonempty("Post ID is required"),
  user: z.string().nonempty("User ID is required"),
  content: z.string().nonempty("Content is required"),
});

export const updateCommentValidationSchema = z.object({
  content: z.string().optional(),
});
