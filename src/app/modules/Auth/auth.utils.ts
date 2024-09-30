import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

export const createToken = (
  
   jwtPayload:{
    userId: mongoose.Types.ObjectId,
    username: string,
    email: string,
    role: string,
    profilePhoto:string
  },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
