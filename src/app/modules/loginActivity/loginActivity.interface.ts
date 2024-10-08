import mongoose, { Types } from "mongoose";

export interface ILoginHitory extends Document {
  actionType:string
  user: Types.ObjectId
  name: string,
  email: string,
  ip: string;
  device: string; 
  createdAt: Date;
}