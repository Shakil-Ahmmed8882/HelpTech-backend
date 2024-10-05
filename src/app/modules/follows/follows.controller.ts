import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FollowService } from './follows.service'; // Assuming you have a FollowService with necessary methods

// Create a follow (follow a user)
const followUser = catchAsync(async (req, res) => {
  const { follower, following } = req.body;
  const result = await FollowService.createFollow(follower, following);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User followed successfully',
    data: result,
  });
});

// Unfollow a user
const unfollowUser = catchAsync(async (req, res) => {
  const { id } = req.params; 
  await FollowService.deleteFollow(id);

  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User unfollowed successfully',
    data: null,
  });
});

// Get all users followed by a specific user
const getFollowings = catchAsync(async (req, res) => {
  const  userId  = req.params.id; 
  const result = await FollowService.getFollowings(userId,req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Followings are retrieved successfully',
    meta: result.meta, 
    data: result.data,
  });
});

// Get all followers of a specific user
const getFollowers = catchAsync(async (req, res) => {
  const  userId = req.params.id; 
  const result = await FollowService.getFollowers(userId,req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Follwers are retrieved successfully',
    meta: result.meta, 
    data: result.data,
  });
});



// Check if a user is following another user
const isFollowing = catchAsync(async (req, res) => {
  
  const result = await FollowService.isFollowing(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User is ${result.isFollowing ? '' : 'not '}following the target user`,
    data: result
  });
});

export const FollowController = {
  followUser,
  unfollowUser,
  getFollowings,
  getFollowers,
  isFollowing
};