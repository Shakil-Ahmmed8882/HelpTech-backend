import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentService } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const result = await CommentService.createComment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment is created successfully',
    data: result,
  });
});

const findCommentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CommentService.findCommentById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment is retrieved successfully',
    data: result,
  });
});

const getAllComments = catchAsync(async (req, res) => {
  const result = await CommentService.getAllComments(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateCommentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CommentService.updateCommentById(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment is updated successfully',
    data: result,
  });
});

const deleteCommentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CommentService.deleteCommentById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment is deleted successfully',
    data: result && null,
  });
});

export const CommentController = {
  createComment,
  findCommentById,
  getAllComments,
  updateCommentById,
  deleteCommentById,
};
