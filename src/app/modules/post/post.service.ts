import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { PostSearchableFields } from './post.constant';
import { IPost } from './post.interface';
import { Post } from './post.model';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';
import createAnalyticsRecord from '../../utils/createAnalyticsRecord';
import { IUser } from '../User/user.interface';
import { User } from '../User/user.model';
import { demoPostImagUrl } from '../../contants';

const createPost = async (userId: string, payload: IPost) => {
  // post and record it as analytics
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (userId.toString() !== payload.author.toString()) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Please provide author id same as userId',
      );
    }

    payload.images = payload.images && payload.images.length > 0 ? payload.images : [demoPostImagUrl];
    payload.author = new Types.ObjectId(userId)
    const postResult = await Post.create([payload], { session });

    if (postResult.length > 0) {
      await createAnalyticsRecord(
        {
          post: postResult[0]._id.toString(),
          user: new Types.ObjectId(userId),
          actionType: 'post',
        },
        session,
      );

      // update user post count
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { posts: 1 } },
        { new: true, runValidators: true },
      ).session(session);

      if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
      }
    }
    await session.commitTransaction();
    await session.endSession();
    return postResult;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    console.error('Transaction aborted:', error.message);
    throw error;
  } finally {
    session.endSession();
  }
};

const findPostById = async (postId: string) => {
  return await Post.findById(postId).populate('author');
};

const getAllPosts = async (user: IUser, query: Record<string, unknown>) => {

  
  
  let isPremiumUser = false;

  
  if (user) {
    // If the user exists and is a premium user, set the flag
    if (user && user.isPremiumUser) {
      isPremiumUser = true;
    }
  }

  const postQuery = new QueryBuilder(
    Post.find({
      isDeleted: false,
      ...(isPremiumUser ? {} : { isPremium: false }), 
    }),
    query,
  )
    .search(PostSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery.populate("author");
  const metaData = await postQuery.countTotal();
  return {
    meta: metaData,
    data: result,
  };
};

const myAllPosts = async (userId: string, query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    Post.find({ author: userId, isDeleted: false }),
    query,
  )
    .search(PostSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const metaData = await postQuery.countTotal();
  return {
    meta: metaData,
    data: result,
  };
};

const updatePostById = async (
  userId: string,
  postId: string,
  payload: Partial<IPost>,
) => {

  
  console.log({payload})
  console.log('__________________________________________________________________________________________')
  // check editor is the actual author of this post
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This post does not exist in database',
    );
  }


  const isEditorAndAuthorSame = post.author.toString() === userId;

  if (!isEditorAndAuthorSame) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Opps! you are disallowed to edit this post',
    );
  }

  

  const result = await Post.findByIdAndUpdate({ _id: postId }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deletePostById = async (postId: string, userPayload: JwtPayload) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // business logic ...

    // Find the post by ID
    const post = await Post.findById(postId).session(session);
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if the user is admin or the author of the post
    const isAuthorized =
      userPayload.role === 'admin' ||
      post.author.toString() === userPayload.userId;

    if (!isAuthorized) {
      throw new Error('Not authorized to delete this post');
    }

    // Check if the post is already marked as deleted
    if (post.isDeleted) {
      throw new AppError(httpStatus.CONFLICT, 'Post is already deleted');
    }

    // If authoriz// If authorized, decrease user post count
    await User.findByIdAndUpdate(
      userPayload.userId,
      { $inc: { posts: -1 } },
      { runValidators: true, new: true },
    ).session(session);

    // // If authorizd Proceed to delete the post
    const result = await Post.findByIdAndUpdate(
      postId,
      { isDeleted: true },
      { new: true },
    ).session(session);

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

export const PostService = {
  createPost,
  findPostById,
  getAllPosts,
  myAllPosts,
  updatePostById,
  deletePostById,
};
