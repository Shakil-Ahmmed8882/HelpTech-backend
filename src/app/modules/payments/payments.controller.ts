import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { paymentServices } from './payments.service';


const SSLPaymentHandler = catchAsync(async (req, res) => {
  const paymentData = {
    ...req.body,
    userId: req.user.userId,
  };
  await paymentServices.SSLPayment(paymentData, res);
});

const paymentSuccessHandler = catchAsync(async (req, res) => {
  const transectionId = req.params.transactionID;
  const paymentId = req.params.paymentId;

  

  await paymentServices.paymentSuccess(paymentId, transectionId, res);
});

const paymentFailHandler = catchAsync(async (req, res) => {
  const transectionId = req.params.transactionID;
  const paymentId = req.params.paymentId;
  await paymentServices.paymentFail(paymentId, transectionId, res);
});

const getAllPayments = catchAsync(async (req, res) => {
  const result = await paymentServices.getAllPayments(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All payments are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAllPaymentsOfSingleUser = catchAsync(async (req, res) => {
  const userId = req.user.userId
  const result = await paymentServices.getAllPaymentsOfSingleUser(userId,req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All payments of single  user are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const paymentControllers = {
  SSLPaymentHandler,
  paymentSuccessHandler,
  paymentFailHandler,
  getAllPayments,
  getAllPaymentsOfSingleUser
};
