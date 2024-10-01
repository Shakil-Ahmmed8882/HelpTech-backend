import { z } from 'zod';

// Validation for creating a follow
export const createFollowValidationSchema = z.object({
  body: z.object({
    follower: z.string().min(1, 'Follower ID is required (ID of the user who is following)'), 
    following: z.string().min(1, 'Following ID is required (ID of the user being followed)'), 
  }),
});

// Validation for unfollowing a user


export const FollowValidations = {
  createFollowValidationSchema,
};
