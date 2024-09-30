import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  post: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  comment: string;
  createdAt: Date;
}
