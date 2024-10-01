import mongoose, { Schema } from "mongoose";
import { IFollow } from "./follows.interface";

const followSchema = new Schema<IFollow>({
  follower: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // one who shakil follows Jhanker sir
  following: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // one whos is followed in this case Jhanker sir 
  createdAt: { type: Date, default: Date.now },
});

const Follow = mongoose.model<IFollow>('Follow', followSchema);
export default Follow;