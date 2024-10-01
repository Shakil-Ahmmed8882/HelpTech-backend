import { Router } from 'express';
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
