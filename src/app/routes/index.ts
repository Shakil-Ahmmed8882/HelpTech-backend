import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { PostRoutes } from '../modules/post/post.route';

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

  // extends..
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
