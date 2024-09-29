/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  bio: string;
  password: string;
  role: 'admin' | 'user' | 'driver';
  profilePhoto: string;
  isVerified: boolean;
  status: "ACTIVE" | "BLOCKED" ;
  isPremiumUser: boolean;
  followers: Types.ObjectId[]; // Array of User IDs
  following: Types.ObjectId[]; // Array of User IDs
  posts: Types.ObjectId[]; 
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

