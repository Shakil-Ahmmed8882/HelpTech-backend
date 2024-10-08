import { z } from "zod";

export const createLoginHistorySchema = z.object({
  body: z.object({
    actionType: z.string().min(1, 'Action type is required'),
  }),
});
