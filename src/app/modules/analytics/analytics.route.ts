import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../contants';
import { analyticsServices } from './analytics.service';
import { analyticControllers } from './analytics.controller';

const router = Router();

router.get(
  '/matrix',
  // auth(USER_ROLE.admin),
  analyticControllers.getAnalyticsSummaryMatrix,
);

router.get(
  '/',
  // auth(USER_ROLE.admin),
  analyticControllers.getAllAnalytics,
);



export const AnalyticRoutes = router;
