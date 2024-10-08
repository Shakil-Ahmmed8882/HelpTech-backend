import { Router } from 'express';
import { paymentControllers } from './payments.controller';
import { pamentValidations } from './payments.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../contants';

const router = Router();

router.post(
  '/pay',
  validateRequest(pamentValidations.createPaymentSchema),
  auth(USER_ROLE.user,USER_ROLE.admin),
  paymentControllers.SSLPaymentHandler,
);
router.post(
  '/success/:transactionID/:paymentId',
  paymentControllers.paymentSuccessHandler,
  // auth(USER_ROLE.user),
);
router.post(
  '/fail/:transactionID/:paymentId',
  // auth(USER_ROLE.user),
  paymentControllers.paymentFailHandler,
);

router.get(
  '/',
  auth(USER_ROLE.admin),
  paymentControllers.getAllPayments,
);
router.get(
  '/single-user',
  auth(USER_ROLE.user),
  paymentControllers.getAllPaymentsOfSingleUser,
);



export const paymentRoutes = router;
