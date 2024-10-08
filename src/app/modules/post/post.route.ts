import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PostController } from './post.controller'; // Assuming you have a PostController
import {
  createPostValidationSchema,
  updatePostValidationSchema,
} from './post.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './post.utils';

const router = express.Router();

// Create a new post
router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(createPostValidationSchema),
  PostController.createPost,
);

router.get(
  '/',
  PostController.getAllPosts,
);
router.get(
  '/my-posts',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostController.getMyPosts,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostController.findPostById,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(updatePostValidationSchema),
  PostController.updatePostById,
);

router.delete('/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostController.deletePostById
);

export const PostRoutes = router;
