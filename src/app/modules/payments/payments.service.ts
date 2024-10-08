import { Response } from 'express';
import { SSLPaymentGateway } from './payments.utils';
import { Payment } from './payments.model';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../User/user.model';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { createToken } from '../Auth/auth.utils';

const SSLPayment = async (
  payload: { postId: string; userId: string; amount: number },
  res: Response,
) => {
  try {
    const paymentData = {
      user: payload.userId,
      transactionID: '',
      amount: payload.amount,
    };

    // // send this id from front end
    const result = await Payment.create(paymentData);

    // Update the document and return the updated document
    const urlAndTransactioId = await SSLPaymentGateway(
      payload.amount,
      result?._id,
    );

    res.send(urlAndTransactioId);
  } catch (error: any) {
    // Handle errors
    console.error('Error addming payment :', error.message);
    throw error;
  }
};

const paymentSuccess = async (
  paymentId: string,
  tranId: string,
  res: Response,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (!tranId) {
      throw new Error('Transaction ID is required');
    }

    if (!paymentId) {
      throw new Error('payment Id is required');
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { transactionID: tranId },
      { new: true, runValidators: true, session },
    );

    if (!payment){
      throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found');
    }

    const user = await User.findByIdAndUpdate(
      payment.user,                    
      { isPremiumUser: true },          
      // Return the updated document and include the session for transaction
      { new: true, session }            
    );


    if (!user) {
      throw new AppError(404,'User not found'); 
    }
    

    
    const jwtPayload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      isPremiumUser:user.isPremiumUser,
    };
  
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );
  


    await session.commitTransaction();
    session.endSession();
    res.redirect(`${config.client_url}/pricing/payment-success/${tranId}?token=${accessToken}`);
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error('Error processing payment and updating user:', error.message);
    throw error;
  }
};

const paymentFail = async (
  paymentId: string,
  tranId: string,
  res: Response,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!tranId) {
      throw new Error('Transaction ID is required');
    }

    if (!paymentId) {
      throw new Error('payment Id is required');
    }

    const payment = await Payment.findByIdAndDelete(paymentId, {
      new: true,
    }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    res.redirect(`${config.client_url}/pricing/payment-fail/${tranId}`);
  } catch (error: any) {
    // Rollback the transaction if any error occurs
    await session.abortTransaction();
    session.endSession();

    // Handle errors
    console.error('Error updating booking status:', error.message);
    throw error;
  }
};

const getAllPayments = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(Payment.find(), query)
    .search(['user.name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await paymentQuery.modelQuery.populate('user');
  const metaData = await paymentQuery.countTotal();
  return {
    meta: metaData,
    data: result,
  };
};

export const paymentServices = {
  paymentSuccess,
  paymentFail,
  SSLPayment,
  getAllPayments,
};
