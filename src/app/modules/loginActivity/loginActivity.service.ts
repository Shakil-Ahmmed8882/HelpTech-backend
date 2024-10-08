import mongoose from 'mongoose';
import { LoginHistory } from './loginActivity.model';
import { ILoginHitory } from './loginActivity.interface';
import { User } from '../User/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import UAParser from 'ua-parser-js';
import { Request } from 'express';
import { IUser } from '../User/user.interface';
import { JwtPayload } from 'jsonwebtoken';

const uaParser = new UAParser();

// Create a new login activity
const createLoginHistory = async (
  userId: string,
  req:Request
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();


    const userAgent = req.headers['user-agent'];
    const ip =req.headers['x-forwarded-for'] || req.connection.remoteAddress || '0.0.0.0';

    
    
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Parse the user-agent string to get device info
    const defaultUserAgent = 'Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 5.1)';
    const deviceInfo = uaParser.setUA(userAgent || defaultUserAgent).getResult();


    const foundUser = await User.findById(userId)

    if(!foundUser){
      throw new AppError(httpStatus.NOT_FOUND, "Opps!! This user isn't found!")
    }

    // Create a new login activity with the parsed device info
    const loginActivity = await LoginHistory.create(
      [
        {
          user: foundUser?._id,
          name:foundUser?.username,
          email:foundUser?.email,
          device: deviceInfo?.device.model || 'Unknown', 
          ip
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return loginActivity;
  } catch (error: any) {
    await session.abortTransaction();
    console.error('Transaction aborted:', error.message);
    throw error;
  } finally {
    session.endSession();
  }
};

// Get all login activities of a user
const getAllLoginHistories = async (
  query: Record<string, unknown>
) => {
  const loginActivityQuery = new QueryBuilder(
    LoginHistory.find(),
    query
  ).search(["name","email"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await loginActivityQuery.modelQuery;
  const metaData = await loginActivityQuery.countTotal();

  return {
    meta: metaData,
    data: result,
  };
};


// Get all login activities of a user
const getAllLoginHistoryOfSingleUser = async (
  userId:string,
  query: Record<string, unknown>
) => {
  const loginActivityQuery = new QueryBuilder(
    LoginHistory.find({user:userId}),
    query
  ).search(["name","email"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await loginActivityQuery.modelQuery.populate("user");
  const metaData = await loginActivityQuery.countTotal();

  return {
    meta: metaData,
    data: result,
  };
};



// Delete a login activity record by ID
const deleteLoginHistoryById = async (loginActivityId: string, requester:JwtPayload) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    console.log({loginActivityId})
    console.log({user: requester})

    const foundUser = await User.findById(requester.userId).session(session)
    if(!foundUser){
      throw new AppError(httpStatus.NOT_FOUND, "Opps!! This user isn't found!")
    }

    
    
    const loginHistoryEntry = await LoginHistory.findById(loginActivityId).session(session);
    if (!loginHistoryEntry) {
      throw new AppError(httpStatus.NOT_FOUND, 'Login History not found');
    }

    // Check if the requester is authorized
    const isOwner = loginHistoryEntry.user.toString() === requester?.userId.toString();
    const isAdmin = requester.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Oops!! Unauthorized!");
    }
    
    const result = await LoginHistory.findByIdAndDelete(loginActivityId).session(
      session
    );

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

export const LoginActivityService = {
  createLoginHistory,
  getAllLoginHistories, 
  getAllLoginHistoryOfSingleUser,
  deleteLoginHistoryById,
};