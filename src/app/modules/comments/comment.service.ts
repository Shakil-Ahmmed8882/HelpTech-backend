import QueryBuilder from '../../builder/QueryBuilder';
import { Comment } from './comment.model';
import { IComment } from './comment.interface'; 
import { Post } from '../post/post.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../User/user.model';
import { USER_STATUS } from '../../contants';
import { JwtPayload } from 'jsonwebtoken';

const createComment = async (comment: IComment) => {



  const user = await User.findById(comment.user)
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "This User is not found")
  }

  if(user.status === USER_STATUS.blocked){
    throw new AppError(httpStatus.CONFLICT, "Can't comment as this user is already blocked")
  }


  const post = await Post.findById(comment.post)
  
  if(!post){
    throw new AppError(httpStatus.NOT_FOUND, "This Post is not found")
  }

  if(post.isDeleted){
    throw new AppError(httpStatus.NOT_FOUND, "This post is deleted")
  }


  return await Comment.create(comment);

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

const getAllCommentsOnSinglePost = async ( postId:string,query: Record<string, unknown>) => {
  const commentQuery = new QueryBuilder(Comment.find({post: postId}), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  
    const result = await commentQuery.modelQuery
    .populate({
      path: "user",
      select: "username profilePhoto email", 
    })
    .populate({
      path: "post",
      select: "title content", 
    });


  const metaData = await commentQuery.countTotal();
  return {
    meta: metaData,
    data: result,
  };
};

const   updateCommentById = async (userId:string, commentId: string, payload: Partial<IComment>) => {

  const comment = await Comment.findById(commentId)
  
  if(!comment){
    throw new AppError(httpStatus.NOT_FOUND, "This comment is not found")
  }


  
  if(comment.user.toString() !== userId.toString()){
    throw new AppError(httpStatus.NOT_FOUND, "Opps! You can't edit someone else's comment.")
  }

  const result = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCommentById = async (commentId: string, user: JwtPayload) => {

    
  
  const comment = await Comment.findById(commentId)
  
    // Check if the user is admin or the author of the post
    const isAuthorized = user.role === 'admin' || comment.user.toString() === user.userId.toString();
  if (!isAuthorized) {
    throw new Error('Not authorized to delete this comment');
  }

  const result = await Comment.findByIdAndDelete(commentId);
  return result;
};

export const CommentService = {
  createComment,
  findCommentById,
  getAllComments,
  getAllCommentsOnSinglePost,
  updateCommentById,
  deleteCommentById,
};
