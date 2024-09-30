import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  post: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
}
