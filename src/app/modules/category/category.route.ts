import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
} from './category.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './category.utils';

const router = express.Router();

// Create a new category
router.post(
  '/',
  auth(USER_ROLE.admin), 
  validateRequest(createCategoryValidationSchema),
  CategoryController.createCategory,
);

// Get all categories
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user), 
  CategoryController.getAllCategories,
);

// Get a category by ID
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  CategoryController.getCategoryById,
);

// Update a category by ID
router.patch(
  '/:id',
  auth(USER_ROLE.admin), // Only admins can update categories
  validateRequest(updateCategoryValidationSchema),
  CategoryController.updateCategoryById,
);

// Delete a category by ID
router.delete(
  '/:id',
  auth(USER_ROLE.admin), 
  CategoryController.deleteCategoryById,
);

export const CategoryRoutes = router;
