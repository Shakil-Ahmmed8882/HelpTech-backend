import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FollowController } from './follows.controller';
import {
  createFollowValidationSchema,
} from './follows.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './follows.utils';

const router = express.Router();

// Follow a user
router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user), 
  validateRequest(createFollowValidationSchema),
  FollowController.followUser, 
);

// Unfollow a user
router.delete(
  '/:id', // The ID of the user to unfollow
  auth(USER_ROLE.admin, USER_ROLE.user),
  FollowController.unfollowUser,
);

// Get all followers of a user
router.get(
  '/:id/followers', 
  auth(USER_ROLE.admin, USER_ROLE.user), 
  FollowController.getFollowers, 
);

// Get all user followings
router.get(
  '/:id/following', 
  auth(USER_ROLE.admin, USER_ROLE.user),
  FollowController.getFollowings, 
);

export const FollowRoutes = router;