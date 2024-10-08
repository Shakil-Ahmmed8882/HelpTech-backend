import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';

import bcryptJs from 'bcryptjs';

import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import { demoProfileUrl } from '../../contants';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';
import { USER_ROLE } from '../User/user.utils';
import { User } from '../User/user.model';


const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload.email });


  if (!user) {

    const userData = {
      ...payload,
      profilePhoto: payload.profilePhoto || demoProfileUrl
    }
    const user = await createUser(userData);

    const jwtPayload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      isPremiumUser:user.isPremiumUser,
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
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      isPremiumUser:user.isPremiumUser,
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
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profilePhoto: user.profilePhoto,
    isPremiumUser:user.isPremiumUser,
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
      profilePhoto: userData.profilePhoto || demoProfileUrl,
      role: USER_ROLE.user,
    });

    if (createdUser?._id) {

      const jwtPayload = {
        userId: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
        profilePhoto: createdUser.profilePhoto,
        isPremiumUser:createdUser.isPremiumUser,
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




const forgetPassword = async (userId: string) => {
  // checking if the user is exist
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

 

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  
  const jwtPayload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profilePhoto: user.profilePhoto,
    isPremiumUser:user.isPremiumUser,
  };

  const resetToken = createToken(jwtPayload,config.jwt_access_secret as string,'10m');

  const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token=${resetToken} `;

  sendEmail(user.email, resetUILink);

  console.log(resetUILink);
};




const resetPassword = async (
  payload: { userId: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User?.findById(payload?.userId);


  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  
  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;


  if (payload.userId !== decoded.userId) {
    console.log(payload.userId, decoded.userId);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcryptJs.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      _id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );
};




export const AuthServices = {
  loginUser,
  refreshToken,
  registerUser,
  resetPassword,
  forgetPassword
};
