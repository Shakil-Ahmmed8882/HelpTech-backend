
import  { Schema, Document } from 'mongoose';

export interface IFollow extends Document {
  follower: Schema.Types.ObjectId;
  following: Schema.Types.ObjectId;
  createdAt: Date;
}

