import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { PostSearchableFields } from './post.constant';
import { IPost } from './post.interface';
import { Post } from './post.model';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';
import createAnalyticsRecord from '../../utils/createAnalyticsRecord';

const createPost = async (userId:string, payload: IPost) => {

  // post and record it as analytics
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    
    const postResult = await Post.create([payload],{session});
    
    if(postResult.length > 0){
    await createAnalyticsRecord({
      post: postResult[0]._id.toString(),
      user:new Types.ObjectId(userId), 
      actionType: 'post',
    }, session);
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

const getAllPosts = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find({ isDeleted: false }), query)
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

const deletePostById = async (postId: string, payload: JwtPayload) => {
  // Find the post by ID
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  // Check if the user is admin or the author of the post
  const isAuthorized =
    payload.role === 'admin' || post.author.toString() === payload.userId;

  if (!isAuthorized) {
    throw new Error('Not authorized to delete this post');
  }

  // If authorized, proceed with the deletion
  const result = await Post.findByIdAndUpdate(postId, { isDeleted: true });
  return result;
};

export const PostService = {
  createPost,
  findPostById,
  getAllPosts,
  myAllPosts,
  updatePostById,
  deletePostById,
};
