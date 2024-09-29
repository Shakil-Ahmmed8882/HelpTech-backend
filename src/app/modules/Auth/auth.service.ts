import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';

import bcryptJs from 'bcryptjs';
import { User } from '../User/user.model';
import { USER_ROLE } from '../User/user.utils';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import { demoProfileUrl } from '../../contants';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    const user = await createUser(payload);

    const jwtPayload = {
      email: user.email,
      role: user.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  } else {
    if (payload.password) {
      const isPasswordMatched = await bcryptJs.compare(
        payload.password,
        user.password,
      );

      if (!isPasswordMatched) {
        throw new AppError(httpStatus.NOT_FOUND, 'Password Incorrect!');
      }
    }

    const jwtPayload = {
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
      profilePhoto: user.img || demoProfileUrl,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
  // checking if the user is already deleted
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  // checking if the user is exist
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const registerUser = async (userData: TLoginUser) => {
  // when select manual signup there must be passoword
  const existedUser = await User.findOne({ email: userData.email });

  if (existedUser) {
    throw new Error("User already exist using this same email.")
  }
    if (userData.password) {
      // if manual sign up there is password & hash it
      userData.password = await bcryptJs.hash(
        userData.password,
        Number(config.bcrypt_salt_rounds),
      );
    }

    // if social sign up - create user without password

    const createdUser = await User.create({
      ...userData,
      role: USER_ROLE.user,
    });

    if (createdUser?._id) {
      const jwtPayload = {
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        profilePhoto: userData.img || demoProfileUrl,
      };

      const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
      );

      const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
      );

      return {
        accessToken,
        refreshToken,
      };
    }
};

const createUser = async (userData: TLoginUser) => {
  if (userData.password) {
    userData.password = await bcryptJs.hash(
      userData.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  const user = await User.create({
    ...userData,
    role: USER_ROLE.user,
  });

  return user;
};
export const AuthServices = {
  loginUser,
  refreshToken,
  registerUser,
};
