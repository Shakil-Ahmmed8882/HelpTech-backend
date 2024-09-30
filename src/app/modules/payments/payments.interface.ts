import mongoose, { Document, Types } from 'mongoose';

// Interface for the Post document
export interface IPayment extends Document {
  user: Types.ObjectId;
  amount: number;
  transactionID : string;
}