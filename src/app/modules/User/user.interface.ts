/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export interface IUser {
  userId?:string
  username: string;
  email: string;
  bio: string;
  password: string;
  role: 'admin' | 'user' | 'driver';
  profilePhoto: string;
  isVerified: boolean;
  status: "ACTIVE" | "BLOCKED" ;
  isPremiumUser: boolean;
  followers: number;
  followings: number;
  posts: number;
}




export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomId(id: string): Promise<IUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

