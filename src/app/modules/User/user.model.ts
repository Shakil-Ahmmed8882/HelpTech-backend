/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
// models/User.ts
import mongoose, {  Schema } from 'mongoose';
import { IUser } from './user.interface';
import { validateEmail } from './user.utils';

// User Schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    bio: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCKED'],
        default: 'ACTIVE',
    },
    isPremiumUser: {
      type: Boolean,
      default: false,
    },
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    posts: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        default: [],
      },
    ],
  },
  { timestamps: true},
);









export const User = mongoose.model<IUser>('User', userSchema);
