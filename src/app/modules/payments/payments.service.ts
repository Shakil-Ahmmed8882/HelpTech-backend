
import { Response } from 'express';
import { SSLPaymentGateway } from './payments.utils';
import { Payment } from './payments.model';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../User/user.model';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const SSLPayment = async (
  payload: { postId: string; userId: string; amount: number },
  res: Response,
) => {
  try {
    // Update the document and return the updated document
    const urlAndTransactioId = await SSLPaymentGateway(
      payload.amount,
      payload.userId,
    );

    const paymentData = {
      user: payload.userId,
      transactionID: '',
      amount: payload.amount,
    };

    // // send this id from front end
    await Payment.create(paymentData);

    res.send(urlAndTransactioId);
  } catch (error: any) {
    // Handle errors
    console.error('Error addming payment :', error.message);
    throw error;
  }
};

const paymentSuccess = async (
  userId: string,
  tranId: string,
  res: Response,
) => {
  const session = await mongoose.startSession();

  try {
    // Ensure tranId is provided and is in the correct format
    if (!tranId) {
      throw new Error('Transaction ID is required');
    }

    session.startTransaction();

    // Update the user's premium status
    await User.findByIdAndUpdate(userId, { isPremiumUser: true }, { session });

    // Update the payment record with the transaction ID
    const result = await Payment.findOneAndUpdate(
      { user: userId },
      { transactionID: tranId },
      { new: true, runValidators: true, session },
    );

    // Ensure that a payment record was actually updated
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found');
    }
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Redirect to the success page
    res.send({notice:"payment recored"}).redirect(`${config.client_url}/payment/success/${tranId}`);

    return result;
  } catch (error: any) {
    // Rollback the transaction if any error occurs
    await session.abortTransaction();
    session.endSession();

    // Handle errors
    console.error('Error processing payment and updating user:', error.message);
    throw error;
  }
};

const paymentFail = async (userId: string, tranId: string, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // if payment is failed then delete the created booking
    await User.findByIdAndUpdate(userId, { isPremiumUser: false }).session(
      session,
    );
    await Payment.findOneAndDelete({ user: userId }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    res.send({notice:"payment record is cleaned"}).redirect(`${config.client_url}/payment/fail/${tranId}`);
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
