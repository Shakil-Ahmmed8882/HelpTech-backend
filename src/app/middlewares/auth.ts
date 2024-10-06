// middleware/auth.ts

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { USER_ROLE } from '../modules/User/user.utils';
import AppError from '../errors/AppError';

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    const { decoded, user } = await validateTokenAndFetchUser(token!);

    // Check if role matches required roles
    if (
      requiredRoles.length &&
      !requiredRoles.includes(decoded.role as keyof typeof USER_ROLE)
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    
    
    
    // Attach the user and role to the request object for further use
    req.user = {
      ...decoded,
      role: decoded.role,
      isPremiumUser: user.isPremiumUser,
    };

    next();
  });
};

export default auth;

// utils/authUtils.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/User/user.model';

// Utility to validate token and fetch user
export const validateTokenAndFetchUser = async (token: string) => {
  // Check if token exists
  if (token === config.free_content_access_secret) {
    return {
      user: { isPremiumUser: false },
      decoded: { role: '' },
    };
  }

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  // Verify the token
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  const { email } = decoded;

  // Check if the user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  return {
    decoded,
    user,
  };
};
