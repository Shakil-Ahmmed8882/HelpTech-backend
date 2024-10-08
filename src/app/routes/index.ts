import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { PostRoutes } from '../modules/post/post.route';
import { CommentRoutes } from '../modules/comments/comment.route';
import { VoteRoutes } from '../modules/vote/vote.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { paymentRoutes } from '../modules/payments/payments.route';
import { AnalyticRoutes } from '../modules/analytics/analytics.route';
import { FollowRoutes } from '../modules/follows/follows.route';
import { LoginActivityRoutes } from '../modules/loginActivity/loginActivity.route';

type TModuleRoutes = {
  path: string;
  route: Router;
};

const router = Router();

const moduleRoutes: TModuleRoutes[] = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/votes',
    route: VoteRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/payments',
    route: paymentRoutes,
  },
  {
    path: '/analytics',
    route: AnalyticRoutes,
  },
  {
    path: '/follows',
    route: FollowRoutes,
  },
  {
    path: '/login/logout-histories',
    route: LoginActivityRoutes,
  },

  // extends..
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
