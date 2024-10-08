import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { LoginActivityController } from './loginActivity.controller';  
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../contants';
import { createLoginHistorySchema } from './loginActivity.validation';


const router = express.Router();

// Create a new login activity
router.post(
  '/',
  validateRequest(createLoginHistorySchema),
  auth(USER_ROLE.user, USER_ROLE.admin),
  LoginActivityController.handleCreateLoginHistory,  
);

// Get all login activities of a user
router.get(
  '/single-user',
  auth(USER_ROLE.admin, USER_ROLE.user),
  LoginActivityController.handleGetAllLoginHistoriesOfSingleUser, 
);

// Get a specific login activity by ID
router.get(
  '/',
  auth(USER_ROLE.admin),
  LoginActivityController.handleGetAllLoginHistories,  
);

// Delete a login activity by ID
router.delete(
  '/:activityId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  LoginActivityController.handleDeleteLoginHistoryById,  
);

export const LoginActivityRoutes = router;
