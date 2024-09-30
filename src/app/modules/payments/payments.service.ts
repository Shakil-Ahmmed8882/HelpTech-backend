import { Response } from 'express';
import { SSLPaymentGateway } from './payments.utils';
import { Payment } from './payments.model';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';

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
  try {
    // Ensure tranId is provided and is in the correct format
    if (!tranId) {
      throw new Error('Transaction ID is required');
    }

    const result = await Payment.findOneAndUpdate(
      { user: userId },
      { transactionID: tranId },
      { new: true, runValidators: true },
    );
    
    if (Object.keys(result).length > 0) {
      res.redirect(`${config.client_url}/payment/success/${tranId}`);
    }
    return result;
  } catch (error: any) {
    // Handle errors
    console.error('Error updating booking status:', error.message);
    throw error;
  }
};

const paymentFail = async (userId: string, tranId: string, res: Response) => {

  try {
    // if payment is failed then delete the created booking
    await Payment.findOneAndDelete({user:userId})
    res.redirect(`${config.client_url}/payment/fail/${tranId}`);
  } catch (error:any) {
    // Handle errors
    console.error('Error updating booking status:', error.message);
    throw error;
  }
};

const getAllPayments = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(Payment.find(), query)
    .search(["user.name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await paymentQuery.modelQuery.populate("user");
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
  getAllPayments
};
