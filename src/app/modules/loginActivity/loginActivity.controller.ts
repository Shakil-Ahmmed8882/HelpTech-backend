import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LoginActivityService } from './loginActivity.service';  // Ensure this service exists

const handleCreateLoginHistory = catchAsync(async (req, res) => {
  const userId = req.user.userId;  
  const result = await LoginActivityService.createLoginHistory(userId, req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Login activity is created successfully',
    data: result,
  });
});



const handleGetAllLoginHistories = catchAsync(async (req, res) => {
  const result = await LoginActivityService.getAllLoginHistories(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All login activities are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});


const handleGetAllLoginHistoriesOfSingleUser = catchAsync(async (req, res) => {
  const userId = req?.user?.userId
  const result = await LoginActivityService.getAllLoginHistoryOfSingleUser(userId,req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All login activities for single user are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});


const handleDeleteLoginHistoryById = catchAsync(async (req, res) => {
  const { activityId } = req.params;
  const user = req.user
  const result = await LoginActivityService.deleteLoginHistoryById(activityId,user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login activity is deleted successfully',
    data: result && null,
  });
});

export const LoginActivityController = {
  handleCreateLoginHistory,
  handleGetAllLoginHistories,
  handleGetAllLoginHistoriesOfSingleUser,
  handleDeleteLoginHistoryById,
  
};