import QueryBuilder from '../../builder/QueryBuilder';
import { Comment } from './comment.model';
import { IComment } from './comment.interface';
import { Post } from '../post/post.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../User/user.model';
import { USER_STATUS } from '../../contants';
import { JwtPayload } from 'jsonwebtoken';
import createAnalyticsRecord from '../../utils/createAnalyticsRecord';
import mongoose, { Types } from 'mongoose';

const createComment = async (userId: string, comment: IComment) => {
  // post and record it as analytics
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This User is not found');
    }

    if (user.status === USER_STATUS.blocked) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Can't comment as this user is already blocked",
      );
    }

    const post = await Post.findById(comment.post);

    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'This Post is not found');
    }

    if (post.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, 'This post is deleted');
    }

    await Post.findByIdAndUpdate(
      comment.post,
      { $inc: { comments: 1 } },
      { session },
    );
    const commentResult = await Comment.create([{ ...comment, user: userId }], {
      session,
    });

    if (commentResult.length > 0) {
      await createAnalyticsRecord(
        {
          post: commentResult[0]._id.toString(),
          user: new Types.ObjectId(userId),
          actionType: 'comment',
        },
        session,
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return commentResult;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    console.error('Transaction aborted:', error.message);
    throw error;
  } finally {
    session.endSession();
  }
};

const findCommentById = async (commentId: string) => {
  return await Comment.findById(commentId);
};

const getAllComments = async (query: Record<string, unknown>) => {
  const commentQuery = new QueryBuilder(Comment.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await commentQuery.modelQuery;
  const metaData = await commentQuery.countTotal();
  return {
    meta: metaData,
    data: result,
  };
};

const getAllCommentsOnSinglePost = async (
  postId: string,
  query: Record<string, unknown>,
) => {
  const commentQuery = new QueryBuilder(Comment.find({ post: postId }), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await commentQuery.modelQuery
    .populate({
      path: 'user',
      select: 'username profilePhoto email',
    })
    .populate({
      path: 'post',
      select: 'title content',
    });

  const metaData = await commentQuery.countTotal();
  return {
    meta: metaData,
    data: result,
  };
};

const updateCommentById = async (
  userId: string,
  commentId: string,
  payload: Partial<IComment>,
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'This comment is not found');
  }

  if (comment.user.toString() !== userId.toString()) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Opps! You can't edit someone else's comment.",
    );
  }

  const result = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCommentById = async (commentId: string, user: JwtPayload) => {
  // post and record it as analytics
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const comment = await Comment.findById(commentId);

    // Check if the user is admin or the author of the post
    const isAuthorized =
      user.role === 'admin' ||
      comment.user.toString() === user.userId.toString();
    if (!isAuthorized) {
      throw new Error('Not authorized to delete this comment');
    }

    await Post.findByIdAndUpdate(comment.post, {
      $inc: { comments: -1 },
    }).session(session);
    const result = await Comment.findByIdAndDelete(commentId);
    
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    console.error('Transaction aborted:', error.message);
    throw error;
  } finally {
    session.endSession();
  }
};

export const CommentService = {
  createComment,
  findCommentById,
  getAllComments,
  getAllCommentsOnSinglePost,
  updateCommentById,
  deleteCommentById,
};
