import  { Document, Types } from 'mongoose';

// Interface for the Post document
export interface IPayment extends Document {
  user: string;
  amount: number;
  transactionID : string;
}