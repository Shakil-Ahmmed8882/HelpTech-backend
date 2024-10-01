import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { paymentServices } from './payments.service';

const SSLPaymentHandler = catchAsync(async (req, res) => {
  const paymentData = {
  ...req.body, 
  userId: req.user.userId
  }
  await paymentServices.SSLPayment( paymentData,res);
});

const paymentSuccessHandler = catchAsync(async (req, res) => {

  
  
  const transectionId = req.params.transactionID;
  const userId = req.user.userId;


  
  
  await paymentServices.paymentSuccess(userId,transectionId, res);
  
  
});

const paymentFailHandler = catchAsync(async (req, res) => {

  const transectionId = req.params.transactionID;
  const userId = req.user.userId;
  await paymentServices.paymentFail(userId,transectionId, res);
  
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



export const paymentControllers = {
  SSLPaymentHandler,
  paymentSuccessHandler,
  paymentFailHandler,
  getAllPayments
};