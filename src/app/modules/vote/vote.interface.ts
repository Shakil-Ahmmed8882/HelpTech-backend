import { Types } from "mongoose";

// Enum for Vote Types
export enum VoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

// Interface for the Vote Document
export interface IVote extends Document {
  user: Types.ObjectId;    
  post: Types.ObjectId;    
  voteType: VoteType;      
  createdAt: Date;
}
