import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CommentController } from './comment.controller';  // Ensure to create this controller
import {
  createCommentValidationSchema,
  updateCommentValidationSchema,
} from './comment.validation';  // Ensure to create these validation schemas
import auth from '../../middlewares/auth';
import { USER_ROLE } from './comment.utils';

const router = express.Router();

// Create a new comment
router.post(
  '/',
  auth(USER_ROLE.user,USER_ROLE.admin),  
  validateRequest(createCommentValidationSchema),
  CommentController.createComment,
);

// Get all comments on a specific post 
router.get(
  '/:postId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  CommentController.getAllCommentsOnSinglePost,
);


// Get all comments
router.get('/', auth(USER_ROLE.admin), CommentController.getAllComments);


// Update a comment by ID
router.patch(
  '/:commentId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(updateCommentValidationSchema),
  CommentController.updateCommentById,
);

// Delete a comment by ID
router.delete('/:commentId', auth(USER_ROLE.admin, USER_ROLE.user), CommentController.deleteCommentById);

export const CommentRoutes = router;
