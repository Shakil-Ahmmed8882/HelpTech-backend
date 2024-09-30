import QueryBuilder from '../../builder/QueryBuilder';
import { Comment } from './comment.model';
import { IComment } from './comment.interface'; 

const createComment = async (comment: IComment) => {
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

const updateCommentById = async (commentId: string, payload: Partial<IComment>) => {
  const result = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCommentById = async (commentId: string) => {
  const result = await Comment.findByIdAndDelete(commentId);
  return result;
};

export const CommentService = {
  createComment,
  findCommentById,
  getAllComments,
  updateCommentById,
  deleteCommentById,
};
