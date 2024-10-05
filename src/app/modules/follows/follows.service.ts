import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import Follow from './follows.model';
import mongoose from 'mongoose';
import { User } from '../User/user.model';
import QueryBuilder from '../../builder/QueryBuilder';

// Create a follow (follow a user)
const createFollow = async (followerId: string, followingId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Check if the follower already following this user
    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    }).session(session);

    if (existingFollow) {
      throw new AppError(
        httpStatus.CONFLICT,
        'You are already following this user',
      );
    }

    // Create follow relationship
    const followData = { follower: followerId, following: followingId };
    const follow = await Follow.create([followData], { session });

    // user who is being followed -> follower count + 1
    await User.findByIdAndUpdate(
      followingId,
      { $inc: { followers: 1 } },
      { session },
    );

    // user who follows -> following count + 1
    await User.findByIdAndUpdate(
      followerId,
      { $inc: { followings: 1 } },
      { session },
    );

    await session.commitTransaction();
    return follow[0]; // first index is the created follow
  } catch (error: any) {
    await session.abortTransaction();
    console.error('Transaction aborted:', error.message);
    throw error;
  } finally {
    session.endSession();
  }
};

// Unfollow a user
const deleteFollow = async (followId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const followingData = await Follow.findById(followId);
    if (!followingData) {
      throw new AppError(httpStatus.NOT_FOUND, 'Follow relationship not found');
    }

    // user who is being followed -> follower count - 1
    await User.findByIdAndUpdate(
      followingData?.following,
      { $inc: { followers: -1 } },
      { session },
    );

    // user who follows -> following count - 1
    await User.findByIdAndUpdate(
      followingData.follower,
      { $inc: { followings: -1 } },
      { session },
    );

    // finaly delete following history 
    const result = await Follow.findByIdAndDelete(followId).session(session);
    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    console.error('Transaction aborted:', error.message);
    throw error;
  } finally {
    session.endSession();
  }
};

// Get all users followed by a specific user




const getFollowings = async (userId: string, query: Record<string, unknown>) => {


  const followingQuery = new QueryBuilder(
    Follow.find({ follower: userId }), 
    query,
  )
    .search(["following.username"])
    .filter()
    .sort()
    .paginate()
    .fields();

  
    const result = await followingQuery.modelQuery.populate("following");
    const metaData = await followingQuery.countTotal();
  
    return  {
      meta: metaData,
      data: result,
    }
    
};

// Get all followers of a specific user
const getFollowers = async (userId: string,query:Record<string,unknown>) => {
  const followQuery = new QueryBuilder(
    Follow.find({ following: userId }), 
    query,
  )
    .search(["following.username"])
    .filter()
    .sort()
    .paginate()
    .fields();

  
    const result = await followQuery.modelQuery.populate("follower");
    const metaData = await followQuery.countTotal();
  
    return  {
      meta: metaData,
      data: result,
    }
};



// Check if a user is already following another user
const isFollowing = async (payload:{follower:string,following:string}) => {
  // Check if there is an existing follow relationship
  const existingFollow = await Follow.findOne({
    follower: payload.follower,
    following: payload.following,
  });

  // Return true if the follow relationship exists, otherwise false
  if (!existingFollow) {
    return {isFollowing:false};
  }

  return {isFollowing:true, followId:existingFollow!._id};
};

export const FollowService = {
  createFollow,
  deleteFollow,
  getFollowings,
  getFollowers,
  isFollowing
};
