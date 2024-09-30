import mongoose from 'mongoose';
import { IComment } from './comment.interface';

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    strictPopulate: false, // This allows population even if fields are not strictly defined
  }
);

export const Comment =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);
