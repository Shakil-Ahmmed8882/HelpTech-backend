import { z } from 'zod';

const createPaymentSchema = z.object({
  body: z.object({
    amount: z.number({required_error:"Amount is required"})
  }),
});

export const pamentValidations = {
  createPaymentSchema,
};
