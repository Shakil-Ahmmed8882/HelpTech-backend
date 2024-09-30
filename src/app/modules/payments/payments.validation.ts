import { z } from 'zod';

const createPaymentSchema = z.object({
  body: z.object({
    postId: z.string().nonempty('Post ID is required'),
    amount: z.number({required_error:"Amount is required"})
  }),
});

export const pamentValidations = {
  createPaymentSchema,
};
