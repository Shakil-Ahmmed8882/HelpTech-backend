import mongoose, { Schema} from 'mongoose';
import { IPost } from './post.interface';

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [String],
    category: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    pdfVersion: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    comments: {
      type:Number,
      default: 0

    }
  },
  { timestamps: true },
);

export const Post =  mongoose.models.Post ||  mongoose.model<IPost>('Post', postSchema);
