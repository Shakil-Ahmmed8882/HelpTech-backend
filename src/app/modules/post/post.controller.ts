import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostService } from './post.service'; // Assuming you have a PostService with necessary methods
import { validateTokenAndFetchUser } from '../../middlewares/auth';

const createPost = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await PostService.createPost(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post is created successfully',
    data: result,
  });
});

const findPostById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostService.findPostById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post is retrieved successfully',
    data: result,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const { user } = await validateTokenAndFetchUser(token || 'invalid-token-to-check-if(!token) validation');
  
  
  const result = await PostService.getAllPosts(user, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getMyPosts = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await PostService.myAllPosts(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My All Posts are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updatePostById = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const postId = req?.params?.id;

  const result = await PostService.updatePostById(userId, postId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post is updated successfully',
    data: result,
  });
});

const deletePostById = catchAsync(async (req, res) => {
  const { id } = req.params;
  await PostService.deletePostById(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post is deleted successfully',
    data: null,
  });
});

export const PostController = {
  createPost,
  findPostById,
  getAllPosts,
  getMyPosts,
  updatePostById,
  deletePostById,
};
