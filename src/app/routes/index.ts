import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { PostRoutes } from '../modules/post/post.route';
import { CommentRoutes } from '../modules/comments/comment.route';
import { VoteRoutes } from '../modules/vote/vote.route';

type TModuleRoutes = {
  path: string;
  route: Router;
};

const router = Router();

const moduleRoutes: TModuleRoutes[] = [
  {
    path: '/user',
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

  // extends..
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
