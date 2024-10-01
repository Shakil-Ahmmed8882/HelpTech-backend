import  { Document, Types } from 'mongoose';

// Interface for the Post document
export interface IPost extends Document {
  title: string;
  content: string;
  tags?: string[];
  category: string;
  author: Types.ObjectId;  
  comments:number; 
  upvotes: number;
  downvotes: number;
  isPremium: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  pdfVersion?: string;
}